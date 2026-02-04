import { Router } from "express";
import { createAuthRoutes } from "./authRoutes";
import { createProductRoutes } from "./productRoutes";
import { createReportRoutes } from "./reportRoutes";
import { createAdminRoutes } from "./adminRoutes";
import { LoginController } from "../controllers/LoginController";
import { RegisterController } from "../controllers/RegisterController";
import { UploadController } from "../controllers/UploadController";
import { ReportController } from "../controllers/ReportController";
import { AdminController } from "../controllers/AdminController";
import { AuthMiddleware } from "../http/middleware/AuthMiddleware";

export interface RouteControllers {
  loginController: LoginController;
  registerController: RegisterController;
  uploadController: UploadController;
  reportController: ReportController;
  adminController: AdminController;
}

export function createApiRoutes(
  controllers: RouteControllers,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Mount routes
  router.use("/auth", createAuthRoutes(
    controllers.loginController,
    controllers.registerController
  ));

  router.use("/products", createProductRoutes(
    controllers.uploadController,
    authMiddleware
  ));

  router.use("/reports", createReportRoutes(
    controllers.reportController,
    authMiddleware
  ));

  router.use("/admin", createAdminRoutes(
    controllers.adminController,
    authMiddleware
  ));

  return router;
}

export { createAuthRoutes } from "./authRoutes";
export { createProductRoutes } from "./productRoutes";
export { createReportRoutes } from "./reportRoutes";
export { createAdminRoutes } from "./adminRoutes";
