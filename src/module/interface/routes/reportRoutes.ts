import { Router, Response } from "express";
import { ReportController } from "../controllers/ReportController";
import { AuthMiddleware, AuthenticatedRequest } from "../http/middleware/AuthMiddleware";
import { HttpRequest } from "../http/HttpTypes";

export function createReportRoutes(
  reportController: ReportController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // POST /reports - Create a new report
  router.post(
    "/",
    authMiddleware.authenticate,
    async (req: AuthenticatedRequest, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params as Record<string, string>,
        query: req.query as Record<string, string>,
        headers: { ...req.headers as Record<string, string>, method: 'POST' },
        user: req.user,
      };

      const result = await reportController.handle(httpRequest);
      res.status(result.statusCode).json(result.body);
    }
  );

  // GET /reports - Get all reports for authenticated user
  router.get(
    "/",
    authMiddleware.authenticate,
    async (req: AuthenticatedRequest, res: Response) => {
      const httpRequest: HttpRequest = {
        body: {},
        params: req.params as Record<string, string>,
        query: req.query as Record<string, string>,
        headers: { ...req.headers as Record<string, string>, method: 'GET' },
        user: req.user,
      };

      const result = await reportController.handle(httpRequest);
      res.status(result.statusCode).json(result.body);
    }
  );

  // GET /reports/:id - Get report by ID
  router.get(
    "/:id",
    authMiddleware.authenticate,
    async (req: AuthenticatedRequest, res: Response) => {
      const httpRequest: HttpRequest = {
        body: {},
        params: req.params as Record<string, string>,
        query: req.query as Record<string, string>,
        headers: { ...req.headers as Record<string, string>, method: 'GET' },
        user: req.user,
      };

      const result = await reportController.handle(httpRequest);
      res.status(result.statusCode).json(result.body);
    }
  );

  return router;
}
