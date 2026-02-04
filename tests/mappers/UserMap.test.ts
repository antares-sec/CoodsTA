import { UserMap } from '../../src/module/domain/authentication/mapper/UserMap';
import { User } from '../../src/module/domain/authentication/User';

describe('UserMap', () => {
    const mockUser = User.fromPersistence('user-123', {
        email: 'test@example.com',
        name: 'John Doe',
        password: '$2b$10$hashedpassword',
        role: 'USER',
        created_at: new Date('2024-01-01'),
        update_at: new Date('2024-01-02')
    });

    const mockPrismaUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'John Doe',
        password: '$2b$10$hashedpassword',
        role: 'USER',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02')
    };

    describe('toDomain', () => {
        it('should convert Prisma model to domain entity', () => {
            const user = UserMap.toDomain(mockPrismaUser as any);

            expect(user.id).toBe('user-123');
            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('John Doe');
            expect(user.role).toBe('USER');
        });

        it('should handle missing name by using fallback', () => {
            // The mapper converts null to empty string which then fails domain validation
            // This test verifies the conversion happens, but the domain will throw
            const prismaUser = { ...mockPrismaUser, name: null };

            expect(() => UserMap.toDomain(prismaUser as any)).toThrow('[ERROR][USERNAME]: Name is required');
        });

        it('should handle null password by using empty fallback', () => {
            // Password.createHashed allows empty strings (already hashed passwords from DB)
            const prismaUser = { ...mockPrismaUser, password: null };
            const user = UserMap.toDomain(prismaUser as any);

            expect(user.password).toBe('');
            expect(user.passwordVO.isHashed).toBe(true);
        });
    });

    describe('toPersistence', () => {
        it('should convert domain entity to Prisma create input', () => {
            const persistence = UserMap.toPersistence(mockUser);

            expect(persistence.id).toBe('user-123');
            expect(persistence.email).toBe('test@example.com');
            expect(persistence.name).toBe('John Doe');
            expect(persistence.password).toBe('$2b$10$hashedpassword');
            expect(persistence.role).toBe('USER');
        });
    });

    describe('toUpdatePersistence', () => {
        it('should convert domain entity to Prisma update input', () => {
            const updateData = UserMap.toUpdatePersistence(mockUser);

            expect(updateData.email).toBe('test@example.com');
            expect(updateData.name).toBe('John Doe');
            expect(updateData.password).toBe('$2b$10$hashedpassword');
            expect(updateData.role).toBe('USER');
            expect(updateData).not.toHaveProperty('id');
        });
    });

    describe('toDTO', () => {
        it('should convert domain entity to DTO', () => {
            const dto = UserMap.toDTO(mockUser);

            expect(dto.id).toBe('user-123');
            expect(dto.email).toBe('test@example.com');
            expect(dto.name).toBe('John Doe');
            expect(dto.role).toBe('USER');
            expect(dto.createdAt).toEqual(new Date('2024-01-01'));
            expect(dto.updatedAt).toEqual(new Date('2024-01-02'));
        });

        it('should not include password in DTO', () => {
            const dto = UserMap.toDTO(mockUser);

            expect(dto).not.toHaveProperty('password');
        });
    });

    describe('toDomainBulk', () => {
        it('should convert multiple Prisma models to domain entities', () => {
            const prismaUsers = [
                mockPrismaUser,
                { ...mockPrismaUser, id: 'user-456', email: 'another@example.com' }
            ];

            const users = UserMap.toDomainBulk(prismaUsers as any);

            expect(users).toHaveLength(2);
            expect(users[0].id).toBe('user-123');
            expect(users[1].id).toBe('user-456');
        });

        it('should return empty array for empty input', () => {
            const users = UserMap.toDomainBulk([]);

            expect(users).toHaveLength(0);
        });
    });

    describe('toDTOBulk', () => {
        it('should convert multiple domain entities to DTOs', () => {
            const users = [
                mockUser,
                User.fromPersistence('user-456', {
                    email: 'another@example.com',
                    name: 'Jane Doe',
                    password: 'hashedpass',
                    role: 'ADMIN',
                    created_at: new Date(),
                    update_at: new Date()
                })
            ];

            const dtos = UserMap.toDTOBulk(users);

            expect(dtos).toHaveLength(2);
            expect(dtos[0].id).toBe('user-123');
            expect(dtos[1].id).toBe('user-456');
        });

        it('should return empty array for empty input', () => {
            const dtos = UserMap.toDTOBulk([]);

            expect(dtos).toHaveLength(0);
        });
    });
});
