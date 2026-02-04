import { Router, Request, Response } from "express";
import { LoginController } from "../controllers/LoginController";
import { RegisterController } from "../controllers/RegisterController";
import { HttpRequest } from "../http/HttpTypes";

export function createAuthRoutes(
  loginController: LoginController,
  registerController: RegisterController
): Router {
  const router = Router();

  // POST /auth/login
  router.post("/login", async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
    };

    const result = await loginController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  // POST /auth/register
  router.post("/register", async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params as Record<string, string>,
      query: req.query as Record<string, string>,
      headers: req.headers as Record<string, string>,
    };

    const result = await registerController.handle(httpRequest);
    res.status(result.statusCode).json(result.body);
  });

  return router;
}
