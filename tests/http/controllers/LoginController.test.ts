import { LoginController } from '../../../src/module/interface/controllers/LoginController';
import { LoginUsecase } from '../../../src/module/applications/authentication/LoginUsecase';
import { HttpRequest } from '../../../src/module/interface/http/HttpTypes';

describe('LoginController', () => {
    let loginController: LoginController;
    let mockLoginUsecase: jest.Mocked<LoginUsecase>;

    beforeEach(() => {
        mockLoginUsecase = {
            execute: jest.fn()
        } as any;

        loginController = new LoginController(mockLoginUsecase);
    });

    describe('handle', () => {
        it('should return 200 for successful login', async () => {
            const mockResult = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    name: 'John Doe',
                    role: 'USER'
                },
                tokens: {
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token'
                }
            };
            mockLoginUsecase.execute.mockResolvedValue(mockResult);

            const request: HttpRequest = {
                body: { email: 'test@example.com', password: 'password123' },
                params: {},
                query: {},
                headers: {}
            };

            const response = await loginController.handle(request);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('should call usecase with correct parameters', async () => {
            mockLoginUsecase.execute.mockResolvedValue({
                user: { id: 'user-123', email: 'test@example.com', name: 'John', role: 'USER' },
                tokens: { accessToken: 'token', refreshToken: 'refresh' }
            });

            const request: HttpRequest = {
                body: { email: 'test@example.com', password: 'mypassword' },
                params: {},
                query: {},
                headers: {}
            };

            await loginController.handle(request);

            expect(mockLoginUsecase.execute).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'mypassword'
            });
        });

        it('should return 400 for login validation errors', async () => {
            mockLoginUsecase.execute.mockRejectedValue(
                new Error('[ERROR][LOGIN]: Email is required')
            );

            const request: HttpRequest = {
                body: { email: '', password: 'password123' },
                params: {},
                query: {},
                headers: {}
            };

            const response = await loginController.handle(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Email is required');
        });

        it('should return 400 for invalid credentials', async () => {
            mockLoginUsecase.execute.mockRejectedValue(
                new Error('[ERROR][LOGIN]: Invalid email or password')
            );

            const request: HttpRequest = {
                body: { email: 'test@example.com', password: 'wrongpassword' },
                params: {},
                query: {},
                headers: {}
            };

            const response = await loginController.handle(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Invalid email or password');
        });

        it('should return 500 for unexpected errors', async () => {
            mockLoginUsecase.execute.mockRejectedValue(
                new Error('Database connection failed')
            );

            const request: HttpRequest = {
                body: { email: 'test@example.com', password: 'password123' },
                params: {},
                query: {},
                headers: {}
            };

            const response = await loginController.handle(request);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Database connection failed');
        });

        it('should handle non-Error exceptions', async () => {
            mockLoginUsecase.execute.mockRejectedValue('String error');

            const request: HttpRequest = {
                body: { email: 'test@example.com', password: 'password123' },
                params: {},
                query: {},
                headers: {}
            };

            const response = await loginController.handle(request);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('String error');
        });
    });
});
