import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createApiRoutes, RouteControllers } from "./module/interface/routes";
import { AuthMiddleware } from "./module/interface/http/middleware/AuthMiddleware";

// Infrastructure
import { JWTService } from "./module/infrastructure/auth/JWTService";
import { HashService } from "./module/infrastructure/hash/HashService";
import { StorageService } from "./module/infrastructure/storage/StorageService";
import { ModelStorageService } from "./module/infrastructure/storage/ModelStorageService";

// Prisma Client
import prisma from "./shared/infra/prisma";

// Repositories
import { UserRepository } from "./module/domain/authentication/repository/UserRepository";
import { ProductRepository } from "./module/domain/product/repository/ProductRepository";
import { ReportRepository } from "./module/domain/report/repository/ReportRepository";
import { ModelRepository } from "./module/domain/model/repository/ModelRepository";

// Use Cases
import { LoginUsecase } from "./module/applications/authentication/LoginUsecase";
import { RegisterUsecase } from "./module/applications/authentication/RegisterUsecase";
import { UploadProductUsecase } from "./module/applications/product/UploadProductUsecase";
import { SaveReportUsecase } from "./module/applications/report/SaveReportUsecase";
import { UploadModelUsecase } from "./module/applications/model/UploadModelUsecase";

// Controllers
import { LoginController } from "./module/interface/controllers/LoginController";
import { RegisterController } from "./module/interface/controllers/RegisterController";
import { UploadController } from "./module/interface/controllers/UploadController";
import { ReportController } from "./module/interface/controllers/ReportController";
import { AdminController } from "./module/interface/controllers/AdminController";

export function createApp(): Application {
  const app = express();

  // CORS
  app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  }));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Infrastructure Services
  const jwtService = new JWTService();
  const hashService = new HashService();
  const storageService = new StorageService({ uploadDir: "./uploads/images" });
  const modelStorageService = new ModelStorageService({ uploadDir: "./uploads/models" });

  // Initialize Repositories (with Prisma client)
  const userRepository = new UserRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const reportRepository = new ReportRepository(prisma);
  const modelRepository = new ModelRepository(prisma);

  // Initialize Use Cases
  const loginUsecase = new LoginUsecase(userRepository, hashService, jwtService);
  const registerUsecase = new RegisterUsecase(userRepository, hashService);
  const uploadProductUsecase = new UploadProductUsecase(productRepository, storageService);
  const saveReportUsecase = new SaveReportUsecase(reportRepository, userRepository, productRepository);
  const uploadModelUsecase = new UploadModelUsecase(modelRepository, modelStorageService);

  // Initialize Controllers
  const loginController = new LoginController(loginUsecase);
  const registerController = new RegisterController(registerUsecase);
  const uploadController = new UploadController(uploadProductUsecase, productRepository);
  const reportController = new ReportController(saveReportUsecase, reportRepository);
  const adminController = new AdminController(
    uploadModelUsecase,
    modelRepository,
    userRepository,
    productRepository,
    reportRepository
  );

  // Initialize Auth Middleware
  const authMiddleware = new AuthMiddleware(jwtService);

  // Setup Controllers
  const controllers: RouteControllers = {
    loginController,
    registerController,
    uploadController,
    reportController,
    adminController,
  };

  // Mount API routes
  app.use("/api", createApiRoutes(controllers, authMiddleware));

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
