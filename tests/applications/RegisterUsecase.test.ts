import { RegisterUsecase } from '../../src/module/applications/authentication/RegisterUsecase';
import { UserRepository } from '../../src/module/domain/authentication/repository/UserRepository';
import { HashService } from '../../src/module/infrastructure/hash/HashService';
import { User } from '../../src/module/domain/authentication/User';

describe('RegisterUsecase', () => {
    let registerUsecase: RegisterUsecase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockHashService: jest.Mocked<HashService>;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            fetchAll: jest.fn(),
            deleteById: jest.fn(),
            count: jest.fn()
        } as any;

        mockHashService = {
            hash: jest.fn(),
            compare: jest.fn(),
            generateSalt: jest.fn(),
            hashWithSalt: jest.fn(),
            isHashed: jest.fn()
        } as any;

        registerUsecase = new RegisterUsecase(mockUserRepository, mockHashService);
    });

    describe('execute', () => {
        it('should register user successfully', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockHashService.hash.mockResolvedValue('$2b$10$hashedpassword');
            mockUserRepository.save.mockResolvedValue();

            const result = await registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result.success).toBe(true);
            expect(result.message).toBe('User registered successfully');
            expect(result.userId).toBeDefined();
        });

        it('should throw error for empty name', async () => {
            await expect(registerUsecase.execute({
                name: '',
                email: 'test@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Name is required');
        });

        it('should throw error for null name', async () => {
            await expect(registerUsecase.execute({
                name: null as any,
                email: 'test@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Name is required');
        });

        it('should throw error for whitespace only name', async () => {
            await expect(registerUsecase.execute({
                name: '   ',
                email: 'test@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Name is required');
        });

        it('should throw error for empty email', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: '',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Email is required.');
        });

        it('should throw error for null email', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: null as any,
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Email is required.');
        });

        it('should throw error for whitespace only email', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: '   ',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Email is required.');
        });

        it('should throw error for empty password', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: ''
            })).rejects.toThrow('[ERROR][REGISTER]: Password is required');
        });

        it('should throw error for null password', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: null as any
            })).rejects.toThrow('[ERROR][REGISTER]: Password is required');
        });

        it('should throw error for whitespace only password', async () => {
            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: '   '
            })).rejects.toThrow('[ERROR][REGISTER]: Password is required');
        });

        it('should throw error when email already exists', async () => {
            const existingUser = User.fromPersistence('user-123', {
                email: 'test@example.com',
                name: 'Existing User',
                password: 'hashedpass',
                role: 'USER',
                created_at: new Date(),
                update_at: new Date()
            });
            mockUserRepository.findByEmail.mockResolvedValue(existingUser);

            await expect(registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR][REGISTER]: Email already registered');
        });

        it('should hash password before saving', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockHashService.hash.mockResolvedValue('$2b$10$hashedpassword');
            mockUserRepository.save.mockResolvedValue();

            await registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(mockHashService.hash).toHaveBeenCalledWith('password123');
        });

        it('should normalize email to lowercase', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockHashService.hash.mockResolvedValue('$2b$10$hashedpassword');
            mockUserRepository.save.mockResolvedValue();

            await registerUsecase.execute({
                name: 'John Doe',
                email: 'TEST@EXAMPLE.COM',
                password: 'password123'
            });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should trim name and email', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockHashService.hash.mockResolvedValue('$2b$10$hashedpassword');
            mockUserRepository.save.mockResolvedValue();

            const result = await registerUsecase.execute({
                name: '  John Doe  ',
                email: '  test@example.com  ',
                password: 'password123'
            });

            expect(result.success).toBe(true);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should save user to repository', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockHashService.hash.mockResolvedValue('$2b$10$hashedpassword');
            mockUserRepository.save.mockResolvedValue();

            await registerUsecase.execute({
                name: 'John Doe',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(mockUserRepository.save).toHaveBeenCalled();
            const savedUser = mockUserRepository.save.mock.calls[0][0];
            expect(savedUser.email).toBe('test@example.com');
            expect(savedUser.name).toBe('John Doe');
        });
    });
});
