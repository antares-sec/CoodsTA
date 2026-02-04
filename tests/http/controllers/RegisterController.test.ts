import { RegisterController } from '../../../src/module/interface/controllers/RegisterController';
import { RegisterUsecase } from '../../../src/module/applications/authentication/RegisterUsecase';
import { HttpRequest } from '../../../src/module/interface/http/HttpTypes';

describe('RegisterController', () => {
    let registerController: RegisterController;
    let mockRegisterUsecase: jest.Mocked<RegisterUsecase>;

    beforeEach(() => {
        mockRegisterUsecase = {
            execute: jest.fn()
        } as any;

        registerController = new RegisterController(mockRegisterUsecase);
    });

    describe('handle', () => {
        it('should return 201 for successful registration', async () => {
            mockRegisterUsecase.execute.mockResolvedValue({
                success: true,
                message: 'User registered successfully',
                userId: 'user-123'
            });

            const request: HttpRequest = {
                body: {
                    name: 'John Doe',
                    email: 'test@example.com',
                    password: 'password123'
                },
                params: {},
                query: {},
                headers: {}
            };

            const response = await registerController.handle(request);

            expect(response.statusCode).toBe(201);
            expect(response.body).toBeDefined();
        });

        it('should call usecase with correct parameters', async () => {
            mockRegisterUsecase.execute.mockResolvedValue({
                success: true,
                message: 'User registered successfully',
                userId: 'user-123'
            });

            const request: HttpRequest = {
                body: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: 'securepass'
                },
                params: {},
                query: {},
                headers: {}
            };

            await registerController.handle(request);

            expect(mockRegisterUsecase.execute).toHaveBeenCalledWith({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'securepass'
            });
        });

        it('should return 400 for validation errors', async () => {
            mockRegisterUsecase.execute.mockRejectedValue(
                new Error('[ERROR][REGISTER]: Name is required')
            );

            const request: HttpRequest = {
                body: {
                    name: '',
                    email: 'test@example.com',
                    password: 'password123'
                },
                params: {},
                query: {},
                headers: {}
            };

            const response = await registerController.handle(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Name is required');
        });

        it('should return 400 for duplicate email', async () => {
            mockRegisterUsecase.execute.mockRejectedValue(
                new Error('[ERROR][REGISTER]: Email already registered')
            );

            const request: HttpRequest = {
                body: {
                    name: 'John Doe',
                    email: 'existing@example.com',
                    password: 'password123'
                },
                params: {},
                query: {},
                headers: {}
            };

            const response = await registerController.handle(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Email already registered');
        });

        it('should return 500 for unexpected errors', async () => {
            mockRegisterUsecase.execute.mockRejectedValue(
                new Error('Database connection failed')
            );

            const request: HttpRequest = {
                body: {
                    name: 'John Doe',
                    email: 'test@example.com',
                    password: 'password123'
                },
                params: {},
                query: {},
                headers: {}
            };

            const response = await registerController.handle(request);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('Database connection failed');
        });

        it('should handle non-Error exceptions', async () => {
            mockRegisterUsecase.execute.mockRejectedValue('String error');

            const request: HttpRequest = {
                body: {
                    name: 'John Doe',
                    email: 'test@example.com',
                    password: 'password123'
                },
                params: {},
                query: {},
                headers: {}
            };

            const response = await registerController.handle(request);

            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe('String error');
        });
    });
});
