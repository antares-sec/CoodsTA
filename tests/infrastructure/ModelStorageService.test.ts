import { ModelStorageService, ModelFileData } from '../../src/module/infrastructure/storage/ModelStorageService';
import * as fs from 'fs';
import * as path from 'path';

describe('ModelStorageService', () => {
    const testUploadDir = './test-models';
    let service: ModelStorageService;

    const createTestModelFile = (overrides: Partial<ModelFileData> = {}): ModelFileData => ({
        buffer: Buffer.from('fake model content'),
        originalName: 'model.h5',
        mimeType: 'application/octet-stream',
        size: 1024 * 1024, // 1MB
        ...overrides
    });

    beforeEach(() => {
        service = new ModelStorageService({
            uploadDir: testUploadDir,
            allowedExtensions: ['.h5', '.keras', '.pkl', '.pt', '.pth', '.onnx', '.pb', '.tflite', '.safetensors'],
            maxFileSize: 500 * 1024 * 1024 // 500MB
        });
    });

    afterEach(async () => {
        // Clean up test models directory
        if (fs.existsSync(testUploadDir)) {
            const files = fs.readdirSync(testUploadDir);
            for (const file of files) {
                fs.unlinkSync(path.join(testUploadDir, file));
            }
            fs.rmdirSync(testUploadDir);
        }
    });

    describe('constructor', () => {
        it('should create upload directory if it does not exist', () => {
            const customDir = './custom-models';
            new ModelStorageService({ uploadDir: customDir });

            expect(fs.existsSync(customDir)).toBe(true);

            // Cleanup
            fs.rmdirSync(customDir);
        });

        it('should use default config if none provided', () => {
            const defaultService = new ModelStorageService();
            expect(defaultService).toBeDefined();
        });
    });

    describe('upload', () => {
        it('should upload a valid model file', async () => {
            const file = createTestModelFile();
            const result = await service.upload(file, 'DETECTOR', '1.0.0');

            expect(result.fileName).toBeDefined();
            expect(result.filePath).toBeDefined();
            expect(result.size).toBe(file.size);
        });

        it('should generate filename with model type and version', async () => {
            const file = createTestModelFile();
            const result = await service.upload(file, 'DETECTOR', '2.0.0');

            expect(result.fileName).toContain('detector');
            expect(result.fileName).toContain('v2.0.0');
            expect(result.fileName).toContain('.h5');
        });

        it('should preserve file extension', async () => {
            const file = createTestModelFile({ originalName: 'model.keras' });
            const result = await service.upload(file, 'CLASSIFICATOR', '1.0.0');

            expect(result.fileName.endsWith('.keras')).toBe(true);
        });

        it('should throw error for invalid file extension', async () => {
            const file = createTestModelFile({ originalName: 'model.txt' });

            await expect(service.upload(file, 'DETECTOR', '1.0.0')).rejects.toThrow('[ERROR][MODEL_STORAGE]: Invalid file type');
        });

        it('should throw error for file too large', async () => {
            const file = createTestModelFile({ size: 600 * 1024 * 1024 }); // 600MB

            await expect(service.upload(file, 'DETECTOR', '1.0.0')).rejects.toThrow('[ERROR][MODEL_STORAGE]: File too large');
        });

        it('should accept all allowed extensions', async () => {
            const extensions = ['.h5', '.keras', '.pkl', '.pt', '.pth', '.onnx', '.pb', '.tflite', '.safetensors'];

            for (const ext of extensions) {
                const file = createTestModelFile({ originalName: `model${ext}` });
                const result = await service.upload(file, 'DETECTOR', '1.0.0');
                expect(result.fileName).toBeDefined();
            }
        });

        it('should handle uppercase extensions', async () => {
            const file = createTestModelFile({ originalName: 'model.H5' });
            const result = await service.upload(file, 'DETECTOR', '1.0.0');

            expect(result.fileName).toBeDefined();
        });

        it('should create unique filenames for same model type and version', async () => {
            const file1 = createTestModelFile();
            const file2 = createTestModelFile();

            const result1 = await service.upload(file1, 'DETECTOR', '1.0.0');

            // Wait a bit to ensure different timestamp
            await new Promise(resolve => setTimeout(resolve, 10));

            const result2 = await service.upload(file2, 'DETECTOR', '1.0.0');

            expect(result1.fileName).not.toBe(result2.fileName);
        });
    });

    describe('delete', () => {
        it('should delete an existing model file', async () => {
            const file = createTestModelFile();
            const uploadResult = await service.upload(file, 'DETECTOR', '1.0.0');

            const deleted = await service.delete(uploadResult.filePath);

            expect(deleted).toBe(true);
            expect(fs.existsSync(uploadResult.filePath)).toBe(false);
        });

        it('should return false for non-existent file', async () => {
            const deleted = await service.delete('/non/existent/path/model.h5');

            expect(deleted).toBe(false);
        });
    });

    describe('exists', () => {
        it('should return true for existing file', async () => {
            const file = createTestModelFile();
            const uploadResult = await service.upload(file, 'DETECTOR', '1.0.0');

            const exists = service.exists(uploadResult.filePath);

            expect(exists).toBe(true);
        });

        it('should return false for non-existent file', () => {
            const exists = service.exists('/non/existent/path/model.h5');

            expect(exists).toBe(false);
        });
    });
});
