import { Router, Response } from "express";
import { AdminController } from "../controllers/AdminController";
import { AuthMiddleware, AuthenticatedRequest } from "../http/middleware/AuthMiddleware";
import { uploadModel } from "../http/middleware/UploadMiddleware";
import { HttpRequest } from "../http/HttpTypes";

export function createAdminRoutes(
  adminController: AdminController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // Apply authentication and admin role check to all admin routes
  router.use(authMiddleware.authenticate, authMiddleware.requireRole("ADMIN"));

  // GET /admin/users - Get all users
  router.get("/users", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'get-users' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // POST /admin/models - Upload a new ML model
  router.post(
    "/models",
    uploadModel.single("model"),
    async (req: AuthenticatedRequest, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: { ...req.params as Record<string, string>, action: 'upload-model' },
        query: req.query as Record<string, string>,
        headers: req.headers as Record<string, string>,
        user: req.user,
        file: req.file,
      };

      const result = await adminController.handle(httpRequest);
      res.status(result.statusCode).json(result.body);
    }
  );

  // GET /admin/models - Get all models
  router.get("/models", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'get-models' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // GET /admin/products - Get all products
  router.get("/products", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'get-products' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // DELETE /admin/models/:id - Delete a model
  router.delete("/models/:id", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'delete-model' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // DELETE /admin/products/:id - Delete a product
  router.delete("/products/:id", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'delete-product' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // DELETE /admin/users/:id - Delete a user
  router.delete("/users/:id", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'delete-user' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // GET /admin/dashboard - Get dashboard statistics
  router.get("/dashboard", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { action: 'dashboard' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // GET /admin/metrics - Get system metrics
  router.get("/metrics", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { action: 'metrics' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // GET /admin/reports - Get all reports
  router.get("/reports", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { action: 'get-reports' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // DELETE /admin/reports/:id - Delete a report
  router.delete("/reports/:id", async (req: AuthenticatedRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: { ...req.params as Record<string, string>, action: 'delete-report' },
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
      user: req.user,
    };

    const result = await adminController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  return router;
}
