import { Router, Request, Response } from "express";
import { UploadController } from "../controllers/UploadController";
import { AuthMiddleware, AuthenticatedRequest } from "../http/middleware/AuthMiddleware";
import { uploadImage } from "../http/middleware/UploadMiddleware";
import { HttpRequest } from "../http/HttpTypes";

export function createProductRoutes(
  uploadController: UploadController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  // POST /products - Upload a new product
  router.post(
    "/",
    authMiddleware.authenticate,
    uploadImage.single("image"),
    async (req: AuthenticatedRequest, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        params: req.params as Record<string, string>,
        query: req.query as Record<string, string>,
        headers: { ...req.headers as Record<string, string>, method: 'POST' },
        user: req.user,
        file: req.file,
      };

      const result = await uploadController.handle(httpRequest);
      res.status(result.statusCode).json(result.body);
    }
  );

  // GET /products - Get all products
  router.get("/", async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      headers: { ...req.headers as Record<string, string>, method: 'GET' },
    };

    const result = await uploadController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // GET /products/:id - Get product by ID
  router.get("/:id", async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {},
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      headers: { ...req.headers as Record<string, string>, method: 'GET' },
    };

    const result = await uploadController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  return router;
}
