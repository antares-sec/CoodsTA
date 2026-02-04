import { LoginUsecase } from '../../src/module/applications/authentication/LoginUsecase';
import { UserRepository } from '../../src/module/domain/authentication/repository/UserRepository';
import { HashService } from '../../src/module/infrastructure/hash/HashService';
import { JWTService } from '../../src/module/infrastructure/auth/JWTService';
import { User } from '../../src/module/domain/authentication/User';

describe('LoginUsecase', () => {
    let loginUsecase: LoginUsecase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockHashService: jest.Mocked<HashService>;
    let mockJwtService: jest.Mocked<JWTService>;

    const mockUser = User.fromPersistence('user-123', {
        email: 'test@example.com',
        name: 'John Doe',
        password: '$2b$10$hashedpassword',
        role: 'USER',
        created_at: new Date(),
        update_at: new Date()
    });

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

        mockJwtService = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            generateTokenPair: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            decodeToken: jest.fn(),
            refreshTokens: jest.fn()
        } as any;

        loginUsecase = new LoginUsecase(mockUserRepository, mockHashService, mockJwtService);
    });

    describe('execute', () => {
        it('should login successfully with valid credentials', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockHashService.compare.mockResolvedValue(true);
            mockJwtService.generateTokenPair.mockReturnValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token'
            });

            const result = await loginUsecase.execute({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(result.user.id).toBe('user-123');
            expect(result.user.email).toBe('test@example.com');
            expect(result.user.name).toBe('John Doe');
            expect(result.tokens.accessToken).toBe('access-token');
            expect(result.tokens.refreshToken).toBe('refresh-token');
        });

        it('should throw error for empty email', async () => {
            await expect(loginUsecase.execute({
                email: '',
                password: 'password123'
            })).rejects.toThrow('[ERROR][LOGIN]: Email is required');
        });

        it('should throw error for null email', async () => {
            await expect(loginUsecase.execute({
                email: null as any,
                password: 'password123'
            })).rejects.toThrow('[ERROR][LOGIN]: Email is required');
        });

        it('should throw error for whitespace only email', async () => {
            await expect(loginUsecase.execute({
                email: '   ',
                password: 'password123'
            })).rejects.toThrow('[ERROR][LOGIN]: Email is required');
        });

        it('should throw error for empty password', async () => {
            await expect(loginUsecase.execute({
                email: 'test@example.com',
                password: ''
            })).rejects.toThrow('[ERROR][LOGIN]: Password is required');
        });

        it('should throw error for null password', async () => {
            await expect(loginUsecase.execute({
                email: 'test@example.com',
                password: null as any
            })).rejects.toThrow('[ERROR][LOGIN]: Password is required');
        });

        it('should throw error for whitespace only password', async () => {
            await expect(loginUsecase.execute({
                email: 'test@example.com',
                password: '   '
            })).rejects.toThrow('[ERROR][LOGIN]: Password is required');
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(loginUsecase.execute({
                email: 'nonexistent@example.com',
                password: 'password123'
            })).rejects.toThrow('[ERROR][LOGIN]: Invalid email or password');
        });

        it('should throw error for invalid password', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockHashService.compare.mockResolvedValue(false);

            await expect(loginUsecase.execute({
                email: 'test@example.com',
                password: 'wrongpassword'
            })).rejects.toThrow('[ERROR][LOGIN]: Invalid email or password');
        });

        it('should normalize email to lowercase', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockHashService.compare.mockResolvedValue(true);
            mockJwtService.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            await loginUsecase.execute({
                email: 'TEST@EXAMPLE.COM',
                password: 'password123'
            });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should trim email whitespace', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockHashService.compare.mockResolvedValue(true);
            mockJwtService.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            await loginUsecase.execute({
                email: '  test@example.com  ',
                password: 'password123'
            });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should generate token pair with correct payload', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockHashService.compare.mockResolvedValue(true);
            mockJwtService.generateTokenPair.mockReturnValue({
                accessToken: 'token',
                refreshToken: 'refresh'
            });

            await loginUsecase.execute({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(mockJwtService.generateTokenPair).toHaveBeenCalledWith({
                userId: 'user-123',
                email: 'test@example.com',
                role: 'USER'
            });
        });
    });
});
