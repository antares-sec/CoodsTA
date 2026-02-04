import { HttpRequest, HttpResponse, ok, badRequest, serverError } from "../http/HttpTypes";
import { LoginUsecase } from "../../applications/authentication/LoginUsecase";
import { AuthPresenter } from "../presenters/AuthPresenter";

/**
 * LoginController - Handles POST /auth/login
 */
export class LoginController {
    constructor(private readonly loginUsecase: LoginUsecase) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = request.body;

            const result = await this.loginUsecase.execute({ email, password });

            return ok(AuthPresenter.loginSuccess(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            
            if (message.includes('[ERROR][LOGIN]')) {
                return badRequest(message.replace('[ERROR][LOGIN]: ', ''));
            }
            
            return serverError(message);
        }
    }
}
