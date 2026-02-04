import { User } from '../../../src/module/domain/authentication/User';

describe('User Entity', () => {
    const validUserProps = {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'password123',
        role: 'USER',
        created_at: new Date('2024-01-01'),
        update_at: new Date('2024-01-02')
    };

    describe('create', () => {
        it('should create a valid user', () => {
            const user = User.create('user-123', validUserProps);

            expect(user.id).toBe('user-123');
            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('John Doe');
            expect(user.role).toBe('USER');
        });

        it('should throw error when id is empty', () => {
            expect(() => User.create('', validUserProps)).toThrow('[ERROR][USER]: User ID is required');
        });

        it('should throw error when id is null', () => {
            expect(() => User.create(null as any, validUserProps)).toThrow('[ERROR][USER]: User ID is required');
        });

        it('should throw error when id is undefined', () => {
            expect(() => User.create(undefined as any, validUserProps)).toThrow('[ERROR][USER]: User ID is required');
        });

        it('should create user with ADMIN role', () => {
            const user = User.create('user-123', { ...validUserProps, role: 'ADMIN' });

            expect(user.role).toBe('ADMIN');
        });

        it('should handle isHashed flag', () => {
            const user = User.create('user-123', { ...validUserProps, isHashed: true });

            expect(user.passwordVO.isHashed).toBe(true);
        });

        it('should default isHashed to false', () => {
            const user = User.create('user-123', validUserProps);

            expect(user.passwordVO.isHashed).toBe(false);
        });
    });

    describe('fromPersistence', () => {
        it('should create user from persistence with isHashed true', () => {
            const hashedPassword = '$2b$10$abcdefghijklmnop';
            const user = User.fromPersistence('user-123', {
                ...validUserProps,
                password: hashedPassword
            });

            expect(user.id).toBe('user-123');
            expect(user.password).toBe(hashedPassword);
            expect(user.passwordVO.isHashed).toBe(true);
        });
    });

    describe('getters', () => {
        let user: User;

        beforeEach(() => {
            user = User.create('user-123', validUserProps);
        });

        it('should return id', () => {
            expect(user.id).toBe('user-123');
        });

        it('should return email', () => {
            expect(user.email).toBe('test@example.com');
        });

        it('should return emailVO', () => {
            expect(user.emailVO.value).toBe('test@example.com');
        });

        it('should return name', () => {
            expect(user.name).toBe('John Doe');
        });

        it('should return nameVO', () => {
            expect(user.nameVO.value).toBe('John Doe');
        });

        it('should return password', () => {
            expect(user.password).toBe('password123');
        });

        it('should return passwordVO', () => {
            expect(user.passwordVO.value).toBe('password123');
        });

        it('should return role', () => {
            expect(user.role).toBe('USER');
        });

        it('should return roleVO', () => {
            expect(user.roleVO.value).toBe('USER');
        });

        it('should return createdAt', () => {
            expect(user.createdAt).toEqual(new Date('2024-01-01'));
        });

        it('should return updatedAt', () => {
            expect(user.updatedAt).toEqual(new Date('2024-01-02'));
        });
    });

    describe('validation', () => {
        it('should throw error for invalid email format', () => {
            expect(() => User.create('user-123', {
                ...validUserProps,
                email: 'invalid-email'
            })).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for empty email', () => {
            expect(() => User.create('user-123', {
                ...validUserProps,
                email: ''
            })).toThrow('[ERROR][EMAIL]: Email is required');
        });

        it('should throw error for invalid role', () => {
            expect(() => User.create('user-123', {
                ...validUserProps,
                role: 'SUPERADMIN'
            })).toThrow();
        });

        it('should throw error for name too short', () => {
            expect(() => User.create('user-123', {
                ...validUserProps,
                name: 'A'
            })).toThrow('[ERROR][USERNAME]: Name must be at least 2 characters');
        });

        it('should throw error for empty password', () => {
            expect(() => User.create('user-123', {
                ...validUserProps,
                password: ''
            })).toThrow('[ERROR][PASSWORD] : PASSWORD IS REQUIRED');
        });
    });

    describe('equals', () => {
        it('should return true for users with same id', () => {
            const user1 = User.create('user-123', validUserProps);
            const user2 = User.create('user-123', { ...validUserProps, name: 'Different Name' });

            expect(user1.equals(user2)).toBe(true);
        });

        it('should return false for users with different ids', () => {
            const user1 = User.create('user-123', validUserProps);
            const user2 = User.create('user-456', validUserProps);

            expect(user1.equals(user2)).toBe(false);
        });
    });
});
