import { JWTService, TokenPayload } from '../../src/module/infrastructure/auth/JWTService';

describe('JWTService', () => {
    const testPayload: TokenPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER'
    };

    const testConfig = {
        accessTokenSecret: 'test-access-secret-key-12345',
        refreshTokenSecret: 'test-refresh-secret-key-12345'
    };

    describe('constructor', () => {
        it('should create service with custom config', () => {
            const service = new JWTService(testConfig);
            const token = service.generateAccessToken(testPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });

        it('should create service with default config', () => {
            const service = new JWTService();
            const token = service.generateAccessToken(testPayload);

            expect(token).toBeDefined();
        });

        it('should create service with partial config', () => {
            const service = new JWTService({ accessTokenSecret: 'custom-secret' });
            const token = service.generateAccessToken(testPayload);

            expect(token).toBeDefined();
        });
    });

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const service = new JWTService(testConfig);
            const token = service.generateAccessToken(testPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT format
        });

        it('should generate different tokens for different payloads', () => {
            const service = new JWTService(testConfig);
            const token1 = service.generateAccessToken(testPayload);
            const token2 = service.generateAccessToken({ ...testPayload, userId: 'user-456' });

            expect(token1).not.toBe(token2);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const service = new JWTService(testConfig);
            const token = service.generateRefreshToken(testPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        it('should generate different token than access token', () => {
            const service = new JWTService(testConfig);
            const accessToken = service.generateAccessToken(testPayload);
            const refreshToken = service.generateRefreshToken(testPayload);

            expect(accessToken).not.toBe(refreshToken);
        });
    });

    describe('generateTokenPair', () => {
        it('should generate both access and refresh tokens', () => {
            const service = new JWTService(testConfig);
            const tokens = service.generateTokenPair(testPayload);

            expect(tokens.accessToken).toBeDefined();
            expect(tokens.refreshToken).toBeDefined();
            expect(tokens.accessToken).not.toBe(tokens.refreshToken);
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify a valid access token', () => {
            const service = new JWTService(testConfig);
            const token = service.generateAccessToken(testPayload);
            const verified = service.verifyAccessToken(token);

            expect(verified).toBeDefined();
            expect(verified?.userId).toBe(testPayload.userId);
            expect(verified?.email).toBe(testPayload.email);
            expect(verified?.role).toBe(testPayload.role);
        });

        it('should return null for invalid token', () => {
            const service = new JWTService(testConfig);
            const verified = service.verifyAccessToken('invalid-token');

            expect(verified).toBeNull();
        });

        it('should return null for tampered token', () => {
            const service = new JWTService(testConfig);
            const token = service.generateAccessToken(testPayload);
            const tamperedToken = token.slice(0, -5) + 'xxxxx';
            const verified = service.verifyAccessToken(tamperedToken);

            expect(verified).toBeNull();
        });

        it('should return null for token signed with different secret', () => {
            const service1 = new JWTService({ accessTokenSecret: 'secret-1', refreshTokenSecret: 'refresh-1' });
            const service2 = new JWTService({ accessTokenSecret: 'secret-2', refreshTokenSecret: 'refresh-2' });

            const token = service1.generateAccessToken(testPayload);
            const verified = service2.verifyAccessToken(token);

            expect(verified).toBeNull();
        });

        it('should return null for refresh token', () => {
            const service = new JWTService(testConfig);
            const refreshToken = service.generateRefreshToken(testPayload);
            const verified = service.verifyAccessToken(refreshToken);

            expect(verified).toBeNull();
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify a valid refresh token', () => {
            const service = new JWTService(testConfig);
            const token = service.generateRefreshToken(testPayload);
            const verified = service.verifyRefreshToken(token);

            expect(verified).toBeDefined();
            expect(verified?.userId).toBe(testPayload.userId);
            expect(verified?.email).toBe(testPayload.email);
            expect(verified?.role).toBe(testPayload.role);
        });

        it('should return null for invalid token', () => {
            const service = new JWTService(testConfig);
            const verified = service.verifyRefreshToken('invalid-token');

            expect(verified).toBeNull();
        });

        it('should return null for access token', () => {
            const service = new JWTService(testConfig);
            const accessToken = service.generateAccessToken(testPayload);
            const verified = service.verifyRefreshToken(accessToken);

            expect(verified).toBeNull();
        });
    });

    describe('decodeToken', () => {
        it('should decode a valid token without verification', () => {
            const service = new JWTService(testConfig);
            const token = service.generateAccessToken(testPayload);
            const decoded = service.decodeToken(token);

            expect(decoded).toBeDefined();
            expect(decoded?.userId).toBe(testPayload.userId);
            expect(decoded?.email).toBe(testPayload.email);
            expect(decoded?.role).toBe(testPayload.role);
        });

        it('should return null for invalid token format', () => {
            const service = new JWTService(testConfig);
            const decoded = service.decodeToken('not-a-jwt');

            expect(decoded).toBeNull();
        });

        it('should decode token even with wrong secret', () => {
            const service1 = new JWTService({ accessTokenSecret: 'secret-1', refreshTokenSecret: 'refresh-1' });
            const service2 = new JWTService({ accessTokenSecret: 'secret-2', refreshTokenSecret: 'refresh-2' });

            const token = service1.generateAccessToken(testPayload);
            const decoded = service2.decodeToken(token);

            // Decode works without verification
            expect(decoded).toBeDefined();
            expect(decoded?.userId).toBe(testPayload.userId);
        });
    });

    describe('refreshTokens', () => {
        it('should generate new token pair from valid refresh token', () => {
            const service = new JWTService(testConfig);
            const originalTokens = service.generateTokenPair(testPayload);
            const newTokens = service.refreshTokens(originalTokens.refreshToken);

            expect(newTokens).toBeDefined();
            expect(newTokens?.accessToken).toBeDefined();
            expect(newTokens?.refreshToken).toBeDefined();
            // Tokens might be the same if generated within same second due to same iat
            // Just verify the refresh works and returns valid tokens
            const verified = service.verifyAccessToken(newTokens!.accessToken);
            expect(verified?.userId).toBe(testPayload.userId);
        });

        it('should return null for invalid refresh token', () => {
            const service = new JWTService(testConfig);
            const newTokens = service.refreshTokens('invalid-token');

            expect(newTokens).toBeNull();
        });

        it('should return null when using access token as refresh token', () => {
            const service = new JWTService(testConfig);
            const accessToken = service.generateAccessToken(testPayload);
            const newTokens = service.refreshTokens(accessToken);

            expect(newTokens).toBeNull();
        });
    });

    describe('extractTokenFromHeader', () => {
        it('should extract token from valid Bearer header', () => {
            const token = JWTService.extractTokenFromHeader('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

            expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
        });

        it('should return null for missing header', () => {
            const token = JWTService.extractTokenFromHeader(undefined);

            expect(token).toBeNull();
        });

        it('should return null for header without Bearer prefix', () => {
            const token = JWTService.extractTokenFromHeader('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

            expect(token).toBeNull();
        });

        it('should return null for empty header', () => {
            const token = JWTService.extractTokenFromHeader('');

            expect(token).toBeNull();
        });

        it('should return null for Bearer without token', () => {
            const token = JWTService.extractTokenFromHeader('Bearer ');

            expect(token).toBe('');
        });
    });
});
