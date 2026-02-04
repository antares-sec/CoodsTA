import { UserRepository } from "../../domain/authentication/repository/UserRepository";
import { HashService } from "../../infrastructure/hash/HashService";
import { JWTService, TokenPair } from "../../infrastructure/auth/JWTService";
import { UserMap } from "../../domain/authentication/mapper/UserMap";

interface LoginDTO {
    email: string;
    password: string;
}

interface LoginResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    tokens: TokenPair;
}

/**
 * LoginUsecase - Application service for user authentication
 * 
 * Handles:
 * - User login with email and password
 * - Password verification
 * - JWT token generation
 */
export class LoginUsecase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
        private readonly jwtService: JWTService
    ) {}

    async execute(dto: LoginDTO): Promise<LoginResponse> {
        // Validate input
        if (!dto.email || dto.email.trim().length === 0) {
            throw new Error('[ERROR][LOGIN]: Email is required');
        }
        if (!dto.password || dto.password.trim().length === 0) {
            throw new Error('[ERROR][LOGIN]: Password is required');
        }

        // Find user by email
        const user = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
        if (!user) {
            throw new Error('[ERROR][LOGIN]: Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await this.hashService.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new Error('[ERROR][LOGIN]: Invalid email or password');
        }

        // Generate tokens
        const tokens = this.jwtService.generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        // Return user data (without password) and tokens
        const userDTO = UserMap.toDTO(user);

        return {
            user: {
                id: userDTO.id,
                email: userDTO.email,
                name: userDTO.name,
                role: userDTO.role
            },
            tokens
        };
    }
}
