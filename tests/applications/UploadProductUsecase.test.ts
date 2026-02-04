import { UploadProductUsecase } from '../../src/module/applications/product/UploadProductUsecase';
import { ProductRepository } from '../../src/module/domain/product/repository/ProductRepository';
import { StorageService, FileData } from '../../src/module/infrastructure/storage/StorageService';

describe('UploadProductUsecase', () => {
    let uploadProductUsecase: UploadProductUsecase;
    let mockProductRepository: jest.Mocked<ProductRepository>;
    let mockStorageService: jest.Mocked<StorageService>;

    const mockFileData: FileData = {
        buffer: Buffer.from('test image content'),
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024
    };

    beforeEach(() => {
        mockProductRepository = {
            fetchAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            deleteProduct: jest.fn(),
            count: jest.fn()
        } as any;

        mockStorageService = {
            upload: jest.fn(),
            uploadMany: jest.fn(),
            delete: jest.fn(),
            deleteByUrl: jest.fn(),
            exists: jest.fn(),
            getFilePath: jest.fn()
        } as any;

        uploadProductUsecase = new UploadProductUsecase(mockProductRepository, mockStorageService);
    });

    describe('execute', () => {
        it('should upload product successfully', async () => {
            mockStorageService.upload.mockResolvedValue({
                fileName: 'uploaded-image.jpg',
                filePath: './uploads/uploaded-image.jpg',
                url: '/uploads/uploaded-image.jpg',
                size: 1024
            });
            mockProductRepository.save.mockResolvedValue();

            const result = await uploadProductUsecase.execute({
                name: 'Test Jersey',
                category: 'JERSEY',
                image: mockFileData
            });

            expect(result.success).toBe(true);
            expect(result.message).toBe('Product uploaded successfully');
            expect(result.product).toBeDefined();
            expect(result.product?.name).toBe('Test Jersey');
            expect(result.product?.category).toBe('JERSEY');
        });

        it('should throw error for empty name', async () => {
            await expect(uploadProductUsecase.execute({
                name: '',
                category: 'JERSEY',
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Product name is required');
        });

        it('should throw error for null name', async () => {
            await expect(uploadProductUsecase.execute({
                name: null as any,
                category: 'JERSEY',
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Product name is required');
        });

        it('should throw error for whitespace only name', async () => {
            await expect(uploadProductUsecase.execute({
                name: '   ',
                category: 'JERSEY',
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Product name is required');
        });

        it('should throw error for empty category', async () => {
            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: '',
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Category is required');
        });

        it('should throw error for null category', async () => {
            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: null as any,
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Category is required');
        });

        it('should throw error for whitespace only category', async () => {
            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: '   ',
                image: mockFileData
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Category is required');
        });

        it('should throw error when image is missing', async () => {
            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'JERSEY',
                image: null as any
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Image is required');
        });

        it('should throw error when image is undefined', async () => {
            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'JERSEY',
                image: undefined as any
            })).rejects.toThrow('[ERROR][UPLOAD_PRODUCT]: Image is required');
        });

        it('should upload image before creating product', async () => {
            const callOrder: string[] = [];

            mockStorageService.upload.mockImplementation(async () => {
                callOrder.push('upload');
                return {
                    fileName: 'uploaded-image.jpg',
                    filePath: './uploads/uploaded-image.jpg',
                    url: '/uploads/uploaded-image.jpg',
                    size: 1024
                };
            });
            mockProductRepository.save.mockImplementation(async () => {
                callOrder.push('save');
            });

            await uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'JERSEY',
                image: mockFileData
            });

            expect(mockStorageService.upload).toHaveBeenCalledWith(mockFileData);
            expect(callOrder).toEqual(['upload', 'save']);
        });

        it('should convert category to uppercase', async () => {
            mockStorageService.upload.mockResolvedValue({
                fileName: 'uploaded-image.jpg',
                filePath: './uploads/uploaded-image.jpg',
                url: '/uploads/uploaded-image.jpg',
                size: 1024
            });
            mockProductRepository.save.mockResolvedValue();

            const result = await uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'jersey',
                image: mockFileData
            });

            expect(result.product?.category).toBe('JERSEY');
        });

        it('should cleanup uploaded file on product creation error', async () => {
            mockStorageService.upload.mockResolvedValue({
                fileName: 'uploaded-image.jpg',
                filePath: './uploads/uploaded-image.jpg',
                url: '/uploads/uploaded-image.jpg',
                size: 1024
            });
            mockProductRepository.save.mockRejectedValue(new Error('Database error'));

            await expect(uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'JERSEY',
                image: mockFileData
            })).rejects.toThrow('Database error');

            expect(mockStorageService.deleteByUrl).toHaveBeenCalledWith('/uploads/uploaded-image.jpg');
        });

        it('should save product to repository', async () => {
            mockStorageService.upload.mockResolvedValue({
                fileName: 'uploaded-image.jpg',
                filePath: './uploads/uploaded-image.jpg',
                url: '/uploads/uploaded-image.jpg',
                size: 1024
            });
            mockProductRepository.save.mockResolvedValue();

            await uploadProductUsecase.execute({
                name: 'Test Product',
                category: 'JERSEY',
                image: mockFileData
            });

            expect(mockProductRepository.save).toHaveBeenCalled();
            const savedProduct = mockProductRepository.save.mock.calls[0][0];
            expect(savedProduct.name).toBe('Test Product');
            expect(savedProduct.imageUrl).toBe('/uploads/uploaded-image.jpg');
        });
    });
});
