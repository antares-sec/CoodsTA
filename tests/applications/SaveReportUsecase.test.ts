import { SaveReportUsecase } from '../../src/module/applications/report/SaveReportUsecase';
import { ReportRepository } from '../../src/module/domain/report/repository/ReportRepository';
import { UserRepository } from '../../src/module/domain/authentication/repository/UserRepository';
import { ProductRepository } from '../../src/module/domain/product/repository/ProductRepository';
import { User } from '../../src/module/domain/authentication/User';
import { Product } from '../../src/module/domain/product/Product';

describe('SaveReportUsecase', () => {
    let saveReportUsecase: SaveReportUsecase;
    let mockReportRepository: jest.Mocked<ReportRepository>;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockProductRepository: jest.Mocked<ProductRepository>;

    const mockUser = User.fromPersistence('user-123', {
        email: 'test@example.com',
        name: 'John Doe',
        password: 'hashedpassword',
        role: 'USER',
        created_at: new Date(),
        update_at: new Date()
    });

    const mockProduct = Product.fromPersistence('product-123', {
        name: 'Test Jersey',
        category: 'JERSEY',
        image_url: '/uploads/test.jpg',
        created_at: new Date(),
        updated_at: new Date()
    });

    beforeEach(() => {
        mockReportRepository = {
            fetchAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            deleteReport: jest.fn(),
            count: jest.fn(),
            countByResult: jest.fn(),
            getRecentScans: jest.fn()
        } as any;

        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            fetchAll: jest.fn(),
            deleteById: jest.fn(),
            count: jest.fn()
        } as any;

        mockProductRepository = {
            fetchAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            deleteProduct: jest.fn(),
            count: jest.fn()
        } as any;

        saveReportUsecase = new SaveReportUsecase(
            mockReportRepository,
            mockUserRepository,
            mockProductRepository
        );
    });

    describe('execute', () => {
        it('should save report successfully', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockReportRepository.save.mockResolvedValue();

            const result = await saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            });

            expect(result.success).toBe(true);
            expect(result.message).toBe('Report saved successfully');
            expect(result.report).toBeDefined();
            expect(result.report?.userId).toBe('user-123');
            expect(result.report?.productId).toBe('product-123');
            expect(result.report?.authenticityResult).toBe('GENUINE');
            expect(result.report?.confidenceScore).toBe(95);
        });

        it('should throw error for empty userId', async () => {
            await expect(saveReportUsecase.execute({
                userId: '',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: User ID is required');
        });

        it('should throw error for whitespace only userId', async () => {
            await expect(saveReportUsecase.execute({
                userId: '   ',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: User ID is required');
        });

        it('should throw error for empty productId', async () => {
            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: '',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Product ID is required');
        });

        it('should throw error for whitespace only productId', async () => {
            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: '   ',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Product ID is required');
        });

        it('should throw error for missing authenticityResult', async () => {
            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: null as any,
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Authenticity result is required');
        });

        it('should throw error for undefined confidenceScore', async () => {
            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: undefined as any
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Confidence score is required');
        });

        it('should throw error for null confidenceScore', async () => {
            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: null as any
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Confidence score is required');
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(saveReportUsecase.execute({
                userId: 'nonexistent-user',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: User not found');
        });

        it('should throw error when product not found', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockProductRepository.findById.mockResolvedValue(null);

            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'nonexistent-product',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: Product not found');
        });

        it('should save report with COUNTERFEIT result', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockReportRepository.save.mockResolvedValue();

            const result = await saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'COUNTERFEIT',
                confidenceScore: 85
            });

            expect(result.report?.authenticityResult).toBe('COUNTERFEIT');
        });

        it('should verify user exists before product', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            })).rejects.toThrow('[ERROR][SAVE_REPORT]: User not found');

            expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
            expect(mockProductRepository.findById).not.toHaveBeenCalled();
        });

        it('should save report to repository', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockProductRepository.findById.mockResolvedValue(mockProduct);
            mockReportRepository.save.mockResolvedValue();

            await saveReportUsecase.execute({
                userId: 'user-123',
                productId: 'product-123',
                authenticityResult: 'GENUINE',
                confidenceScore: 95
            });

            expect(mockReportRepository.save).toHaveBeenCalled();
            const savedReport = mockReportRepository.save.mock.calls[0][0];
            expect(savedReport.userId).toBe('user-123');
            expect(savedReport.productId).toBe('product-123');
            expect(savedReport.authenticityResult).toBe('GENUINE');
            expect(savedReport.confidenceScore).toBe(95);
        });
    });
});
