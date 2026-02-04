import { UploadModelUsecase } from '../../src/module/applications/model/UploadModelUsecase';
import { ModelRepository } from '../../src/module/domain/model/repository/ModelRepository';
import { ModelStorageService, ModelFileData } from '../../src/module/infrastructure/storage/ModelStorageService';
import { Model } from '../../src/module/domain/model/Model';

describe('UploadModelUsecase', () => {
    let uploadModelUsecase: UploadModelUsecase;
    let mockModelRepository: jest.Mocked<ModelRepository>;
    let mockModelStorageService: jest.Mocked<ModelStorageService>;

    const mockModelFileData: ModelFileData = {
        buffer: Buffer.from('fake model content'),
        originalName: 'model.h5',
        mimeType: 'application/octet-stream',
        size: 1024 * 1024
    };

    const mockActiveModel = Model.fromPersistence('model-old', {
        model_type: 'DETECTOR',
        version: '1.0.0',
        file_path: '/models/old-model.h5',
        accuracy: 90,
        deployment_date: new Date(),
        created_at: new Date(),
        is_active: 'ACTIVE'
    });

    beforeEach(() => {
        mockModelRepository = {
            fetchAll: jest.fn(),
            findById: jest.fn(),
            findActiveModels: jest.fn(),
            findByType: jest.fn(),
            findActiveByType: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        } as any;

        mockModelStorageService = {
            upload: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn()
        } as any;

        uploadModelUsecase = new UploadModelUsecase(mockModelRepository, mockModelStorageService);
    });

    describe('execute', () => {
        it('should upload model successfully', async () => {
            mockModelStorageService.upload.mockResolvedValue({
                fileName: 'detector_v2.0.0_12345.h5',
                filePath: './models/detector_v2.0.0_12345.h5',
                size: 1024 * 1024
            });
            mockModelRepository.findActiveByType.mockResolvedValue(null);
            mockModelRepository.save.mockResolvedValue();

            const result = await uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '2.0.0',
                accuracy: 95,
                file: mockModelFileData
            });

            expect(result.success).toBe(true);
            expect(result.message).toBe('Model uploaded successfully');
            expect(result.model).toBeDefined();
            expect(result.model?.modelType).toBe('DETECTOR');
            expect(result.model?.version).toBe('2.0.0');
            expect(result.model?.accuracy).toBe(95);
        });

        it('should throw error for missing model type', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: null as any,
                version: '1.0.0',
                accuracy: 95,
                file: mockModelFileData
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Model type is required');
        });

        it('should throw error for empty version', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '',
                accuracy: 95,
                file: mockModelFileData
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Version is required');
        });

        it('should throw error for whitespace only version', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '   ',
                accuracy: 95,
                file: mockModelFileData
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Version is required');
        });

        it('should throw error for undefined accuracy', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '1.0.0',
                accuracy: undefined as any,
                file: mockModelFileData
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Accuracy is required');
        });

        it('should throw error for null accuracy', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '1.0.0',
                accuracy: null as any,
                file: mockModelFileData
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Accuracy is required');
        });

        it('should throw error for missing file', async () => {
            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '1.0.0',
                accuracy: 95,
                file: null as any
            })).rejects.toThrow('[ERROR][UPLOAD_MODEL]: Model file is required');
        });

        it('should deactivate existing active model of same type', async () => {
            mockModelStorageService.upload.mockResolvedValue({
                fileName: 'detector_v2.0.0_12345.h5',
                filePath: './models/detector_v2.0.0_12345.h5',
                size: 1024 * 1024
            });
            mockModelRepository.findActiveByType.mockResolvedValue(mockActiveModel);
            mockModelRepository.save.mockResolvedValue();

            await uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '2.0.0',
                accuracy: 95,
                file: mockModelFileData
            });

            // Should be called twice: once for deactivated model, once for new model
            expect(mockModelRepository.save).toHaveBeenCalledTimes(2);

            // First call should be deactivating the old model
            const firstSaveCall = mockModelRepository.save.mock.calls[0][0];
            expect(firstSaveCall.isActive).toBe('DEACTIVATED');
        });

        it('should not deactivate existing model when isActive is false', async () => {
            mockModelStorageService.upload.mockResolvedValue({
                fileName: 'detector_v2.0.0_12345.h5',
                filePath: './models/detector_v2.0.0_12345.h5',
                size: 1024 * 1024
            });
            mockModelRepository.save.mockResolvedValue();

            await uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '2.0.0',
                accuracy: 95,
                file: mockModelFileData,
                isActive: false
            });

            // findActiveByType should not be called when isActive is false
            expect(mockModelRepository.findActiveByType).not.toHaveBeenCalled();
            expect(mockModelRepository.save).toHaveBeenCalledTimes(1);

            const savedModel = mockModelRepository.save.mock.calls[0][0];
            expect(savedModel.isActive).toBe('DEACTIVATED');
        });

        it('should cleanup uploaded file on model creation error', async () => {
            mockModelStorageService.upload.mockResolvedValue({
                fileName: 'detector_v2.0.0_12345.h5',
                filePath: './models/detector_v2.0.0_12345.h5',
                size: 1024 * 1024
            });
            mockModelRepository.findActiveByType.mockResolvedValue(null);
            mockModelRepository.save.mockRejectedValue(new Error('Database error'));

            await expect(uploadModelUsecase.execute({
                modelType: 'DETECTOR',
                version: '2.0.0',
                accuracy: 95,
                file: mockModelFileData
            })).rejects.toThrow('Database error');

            expect(mockModelStorageService.delete).toHaveBeenCalledWith('./models/detector_v2.0.0_12345.h5');
        });

        it('should create CLASSIFICATOR model', async () => {
            mockModelStorageService.upload.mockResolvedValue({
                fileName: 'classificator_v1.0.0_12345.h5',
                filePath: './models/classificator_v1.0.0_12345.h5',
                size: 1024 * 1024
            });
            mockModelRepository.findActiveByType.mockResolvedValue(null);
            mockModelRepository.save.mockResolvedValue();

            const result = await uploadModelUsecase.execute({
                modelType: 'CLASSIFICATOR',
                version: '1.0.0',
                accuracy: 88,
                file: mockModelFileData
            });

            expect(result.model?.modelType).toBe('CLASSIFICATOR');
        });
    });
});
