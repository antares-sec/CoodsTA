import { TokenPair } from "../../infrastructure/auth/JWTService";

/**
 * AuthPresenter - Formats authentication responses to JSON
 * Uses UserMap.toDTO from domain for user data transformation
 */
export class AuthPresenter {
    /**
     * Format login success response
     */
    public static loginSuccess(result: {
        user: { id: string; email: string; name: string; role: string };
        tokens: TokenPair;
    }) {
        return {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role
                },
                tokens: {
                    accessToken: result.tokens.accessToken,
                    refreshToken: result.tokens.refreshToken,
                    tokenType: 'Bearer'
                }
            }
        };
    }

    /**
     * Format register success response
     */
    public static registerSuccess(result: {
        success: boolean;
        message: string;
        userId?: string;
    }) {
        return {
            success: result.success,
            message: result.message,
            data: result.userId ? { userId: result.userId } : null
        };
    }

    /**
     * Format token refresh response
     */
    public static refreshSuccess(tokens: TokenPair) {
        return {
            success: true,
            message: 'Tokens refreshed successfully',
            data: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenType: 'Bearer'
            }
        };
    }
}
