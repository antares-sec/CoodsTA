import { UserRepository } from "../../domain/authentication/repository/UserRepository";
import { HashService } from "../../infrastructure/hash";
import { User } from "../../domain/authentication/User";
import { randomUUID } from "crypto";

interface RegisterDTO{
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse{
    success: boolean;
    message: string;
    userId?: string;
}

export class RegisterUsecase{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
    ){}

    async execute(dto: RegisterDTO): Promise<RegisterResponse>{
        if(!dto.name || dto.name.trim().length === 0){
            throw new Error('[ERROR][REGISTER]: Name is required')
        }
        if(!dto.email || dto.email.trim().length === 0){
            throw new Error('[ERROR][REGISTER]: Email is required.')
        }
        if(!dto.password || dto.password.trim().length === 0){
            throw new Error('[ERROR][REGISTER]: Password is required')
        }

        // Check if email already exists
        const existingUser = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
        if(existingUser){
            throw new Error('[ERROR][REGISTER]: Email already registered');
        }

        // Hash password
        const passwordHash = await this.hashService.hash(dto.password);

        // Create user entity
            const user = User.create(randomUUID(), {
                name: dto.name.trim(),
                email: dto.email.toLowerCase().trim(),
                password: passwordHash,
                role: 'ADMIN', // Set role to ADMIN by default
                created_at: new Date(),
                update_at: new Date(),
                isHashed: true
            });

        // Save user
        await this.userRepository.save(user);

        return {
            success: true,
            message: "User registered successfully",
            userId: user.id
        };
    }
}