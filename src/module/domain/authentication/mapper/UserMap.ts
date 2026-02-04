import { User } from "../User";
import { Prisma, User as UserModel } from "../../../../../generated/prisma";

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;

interface UserDTO {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * UserMap - Mapper class for User entity
 * 
 * Handles transformations between:
 * - Domain Entity (User)
 * - Persistence Model (Prisma UserModel)
 * - DTO (Data Transfer Object for API responses)
 */
export class UserMap {
    /**
     * Convert from Prisma persistence model to Domain entity
     */
    public static toDomain(raw: UserModel): User {
        return User.fromPersistence(raw.id, {
            email: raw.email,
            name: raw.name ?? '',
            password: raw.password ?? '',
            role: raw.role,
            created_at: raw.createdAt,
            update_at: raw.updatedAt
        });
    }

    /**
     * Convert from Domain entity to Prisma create input
     */
    public static toPersistence(user: User): UserCreateInput {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            role: user.role as any
        };
    }

    /**
     * Convert from Domain entity to Prisma update input
     */
    public static toUpdatePersistence(user: User): UserUpdateInput {
        return {
            email: user.email,
            name: user.name,
            password: user.password,
            role: user.role as any
        };
    }

    /**
     * Convert from Domain entity to DTO (excludes sensitive data like password)
     */
    public static toDTO(user: User): UserDTO {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    /**
     * Convert multiple persistence models to Domain entities
     */
    public static toDomainBulk(rawUsers: UserModel[]): User[] {
        return rawUsers.map(raw => this.toDomain(raw));
    }

    /**
     * Convert multiple Domain entities to DTOs
     */
    public static toDTOBulk(users: User[]): UserDTO[] {
        return users.map(user => this.toDTO(user));
    }
}
