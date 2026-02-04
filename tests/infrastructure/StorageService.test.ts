import { StorageService, FileData } from '../../src/module/infrastructure/storage/StorageService';
import * as fs from 'fs';
import * as path from 'path';

describe('StorageService', () => {
    const testUploadDir = './test-uploads';
    let service: StorageService;

    const createTestFile = (overrides: Partial<FileData> = {}): FileData => ({
        buffer: Buffer.from('test file content'),
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        ...overrides
    });

    beforeEach(() => {
        service = new StorageService({
            uploadDir: testUploadDir,
            baseUrl: '/uploads',
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            maxFileSize: 5 * 1024 * 1024 // 5MB
        });
    });

    afterEach(async () => {
        // Clean up test uploads directory
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
            const customDir = './custom-uploads';
            new StorageService({ uploadDir: customDir });

            expect(fs.existsSync(customDir)).toBe(true);

            // Cleanup
            fs.rmdirSync(customDir);
        });

        it('should use default config if none provided', () => {
            const defaultService = new StorageService();
            expect(defaultService).toBeDefined();
        });
    });

    describe('upload', () => {
        it('should upload a valid file', async () => {
            const file = createTestFile();
            const result = await service.upload(file);

            expect(result.fileName).toBeDefined();
            expect(result.filePath).toBeDefined();
            expect(result.url).toContain('/uploads/');
            expect(result.size).toBe(file.size);
        });

        it('should generate unique filename', async () => {
            const file1 = createTestFile();
            const file2 = createTestFile();

            const result1 = await service.upload(file1);
            const result2 = await service.upload(file2);

            expect(result1.fileName).not.toBe(result2.fileName);
        });

        it('should preserve file extension', async () => {
            const file = createTestFile({ originalName: 'photo.png' });
            const result = await service.upload(file);

            expect(result.fileName.endsWith('.png')).toBe(true);
        });

        it('should throw error for invalid mime type', async () => {
            const file = createTestFile({ mimeType: 'application/pdf' });

            await expect(service.upload(file)).rejects.toThrow('[ERROR][STORAGE]: Invalid file type');
        });

        it('should throw error for file too large', async () => {
            const file = createTestFile({ size: 10 * 1024 * 1024 }); // 10MB

            await expect(service.upload(file)).rejects.toThrow('[ERROR][STORAGE]: File too large');
        });

        it('should accept all allowed mime types', async () => {
            const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

            for (const mimeType of mimeTypes) {
                const file = createTestFile({ mimeType, originalName: `test.${mimeType.split('/')[1]}` });
                const result = await service.upload(file);
                expect(result.fileName).toBeDefined();
            }
        });
    });

    describe('uploadMany', () => {
        it('should upload multiple files', async () => {
            const files = [
                createTestFile({ originalName: 'file1.jpg' }),
                createTestFile({ originalName: 'file2.jpg' }),
                createTestFile({ originalName: 'file3.jpg' })
            ];

            const results = await service.uploadMany(files);

            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result.fileName).toBeDefined();
                expect(result.filePath).toBeDefined();
            });
        });

        it('should return empty array for empty input', async () => {
            const results = await service.uploadMany([]);

            expect(results).toHaveLength(0);
        });
    });

    describe('delete', () => {
        it('should delete an existing file', async () => {
            const file = createTestFile();
            const uploadResult = await service.upload(file);

            const deleted = await service.delete(uploadResult.fileName);

            expect(deleted).toBe(true);
            expect(fs.existsSync(uploadResult.filePath)).toBe(false);
        });

        it('should return false for non-existent file', async () => {
            const deleted = await service.delete('non-existent-file.jpg');

            expect(deleted).toBe(false);
        });
    });

    describe('deleteByUrl', () => {
        it('should delete file by URL', async () => {
            const file = createTestFile();
            const uploadResult = await service.upload(file);

            const deleted = await service.deleteByUrl(uploadResult.url);

            expect(deleted).toBe(true);
        });

        it('should return false for non-existent URL', async () => {
            const deleted = await service.deleteByUrl('/uploads/non-existent.jpg');

            expect(deleted).toBe(false);
        });
    });

    describe('exists', () => {
        it('should return true for existing file', async () => {
            const file = createTestFile();
            const uploadResult = await service.upload(file);

            const exists = service.exists(uploadResult.fileName);

            expect(exists).toBe(true);
        });

        it('should return false for non-existent file', () => {
            const exists = service.exists('non-existent-file.jpg');

            expect(exists).toBe(false);
        });
    });

    describe('getFilePath', () => {
        it('should return file path from URL', () => {
            const url = '/uploads/test-file.jpg';
            const filePath = service.getFilePath(url);

            expect(filePath).toBe(path.join(testUploadDir, 'test-file.jpg'));
        });
    });
});
