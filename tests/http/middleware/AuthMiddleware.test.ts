import { AuthMiddleware, AuthenticatedRequest } from '../../../src/module/interface/http/middleware/AuthMiddleware';
import { JWTService, TokenPayload } from '../../../src/module/infrastructure/auth/JWTService';
import { Response, NextFunction } from 'express';

describe('AuthMiddleware', () => {
    let authMiddleware: AuthMiddleware;
    let mockJwtService: jest.Mocked<JWTService>;
    let mockRequest: Partial<AuthenticatedRequest>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.MockedFunction<NextFunction>;

    const validPayload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER'
    };

    beforeEach(() => {
        mockJwtService = {
            verifyAccessToken: jest.fn(),
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            generateTokenPair: jest.fn(),
            verifyRefreshToken: jest.fn(),
            decodeToken: jest.fn(),
            refreshTokens: jest.fn()
        } as any;

        authMiddleware = new AuthMiddleware(mockJwtService);

        mockRequest = {
            headers: {}
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        mockNext = jest.fn();
    });

    describe('authenticate', () => {
        it('should authenticate valid token and set user on request', () => {
            mockRequest.headers = { authorization: 'Bearer valid-token' };
            mockJwtService.verifyAccessToken.mockReturnValue(validPayload);

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockRequest.user).toEqual(validPayload);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 401 for missing authorization header', () => {
            mockRequest.headers = {};

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Missing or invalid authorization header'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 for non-Bearer token', () => {
            mockRequest.headers = { authorization: 'Basic some-token' };

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Missing or invalid authorization header'
            });
        });

        it('should return 401 for empty token after Bearer', () => {
            mockRequest.headers = { authorization: 'Bearer ' };

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Token not provided'
            });
        });

        it('should return 401 for invalid token', () => {
            mockRequest.headers = { authorization: 'Bearer invalid-token' };
            mockJwtService.verifyAccessToken.mockReturnValue(null);

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Invalid or expired token'
            });
        });

        it('should call verifyAccessToken with correct token', () => {
            mockRequest.headers = { authorization: 'Bearer my-token-123' };
            mockJwtService.verifyAccessToken.mockReturnValue(validPayload);

            authMiddleware.authenticate(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockJwtService.verifyAccessToken).toHaveBeenCalledWith('my-token-123');
        });
    });

    describe('requireRole', () => {
        it('should allow access for user with required role', () => {
            mockRequest.user = validPayload;
            const roleMiddleware = authMiddleware.requireRole('USER');

            roleMiddleware(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
        });

        it('should allow access for user with one of multiple required roles', () => {
            mockRequest.user = { ...validPayload, role: 'ADMIN' };
            const roleMiddleware = authMiddleware.requireRole('USER', 'ADMIN');

            roleMiddleware(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 401 if user is not authenticated', () => {
            mockRequest.user = undefined;
            const roleMiddleware = authMiddleware.requireRole('USER');

            roleMiddleware(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Not authenticated'
            });
        });

        it('should return 403 if user does not have required role', () => {
            mockRequest.user = validPayload; // USER role
            const roleMiddleware = authMiddleware.requireRole('ADMIN');

            roleMiddleware(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Insufficient permissions'
            });
        });

        it('should return 403 if user role is not in allowed roles', () => {
            mockRequest.user = validPayload; // USER role
            const roleMiddleware = authMiddleware.requireRole('ADMIN', 'SUPERADMIN');

            roleMiddleware(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext
            );

            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Insufficient permissions'
            });
        });
    });
});
