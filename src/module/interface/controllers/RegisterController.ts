import { HttpRequest, HttpResponse, created, badRequest, serverError } from "../http/HttpTypes";
import { RegisterUsecase } from "../../applications/authentication/RegisterUsecase";
import { AuthPresenter } from "../presenters/AuthPresenter";

/**
 * RegisterController - Handles POST /auth/register
 */
export class RegisterController {
    constructor(private readonly registerUsecase: RegisterUsecase) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { name, email, password } = request.body;

            const result = await this.registerUsecase.execute({ name, email, password });

            return created(AuthPresenter.registerSuccess(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            
            if (message.includes('[ERROR][REGISTER]')) {
                return badRequest(message.replace('[ERROR][REGISTER]: ', ''));
            }
            
            return serverError(message);
        }
    }
}
