import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface JWTConfig {
    accessTokenSecret: string;
    refreshTokenSecret: string;
}


/**
 * JWTService - Infrastructure service for JWT token management
 * 
 * Handles:
 * - Access token generation and verification
 * - Refresh token generation and verification
 * - Token pair generation for authentication flow
 */
export class JWTService {
    private readonly config: JWTConfig;

    constructor(config?: Partial<JWTConfig>) {
        this.config = {
            accessTokenSecret: config?.accessTokenSecret || process.env.JWT_ACCESS_SECRET || 'default-access-secret',
            refreshTokenSecret: config?.refreshTokenSecret || process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
        };
    }

    /**
     * Generate an access token
     */
    public generateAccessToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: "5m"
        };
        return jwt.sign(payload, this.config.accessTokenSecret, options);
    }

    /**
     * Generate a refresh token
     */
    public generateRefreshToken(payload: TokenPayload): string {
        const options: SignOptions = {
            expiresIn: "1d"
        };
        return jwt.sign(payload, this.config.refreshTokenSecret, options);
    }

    /**
     * Generate both access and refresh tokens
     */
    public generateTokenPair(payload: TokenPayload): TokenPair {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }

    /**
     * Verify an access token
     */
    public verifyAccessToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.config.accessTokenSecret) as JwtPayload & TokenPayload;
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Verify a refresh token
     */
    public verifyRefreshToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.config.refreshTokenSecret) as JwtPayload & TokenPayload;
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Decode token without verification (useful for debugging)
     */
    public decodeToken(token: string): TokenPayload | null {
        try {
            const decoded = jwt.decode(token) as JwtPayload & TokenPayload;
            if (!decoded) return null;
            return {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Refresh tokens using a valid refresh token
     */
    public refreshTokens(refreshToken: string): TokenPair | null {
        const payload = this.verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        return this.generateTokenPair(payload);
    }

    /**
     * Extract token from Authorization header
     */
    public static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}

// Singleton instance for convenience
const jwtService = new JWTService();
export default jwtService;
