import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface ModelFileData {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    size: number;
}

export interface ModelUploadResult {
    fileName: string;
    filePath: string;
    size: number;
}

export interface ModelStorageConfig {
    uploadDir: string;
    allowedExtensions: string[];
    maxFileSize: number; // in bytes
}

const DEFAULT_CONFIG: ModelStorageConfig = {
    uploadDir: './models',
    allowedExtensions: ['.h5', '.keras', '.pkl', '.pt', '.pth', '.onnx', '.pb', '.tflite', '.safetensors'],
    maxFileSize: 500 * 1024 * 1024 // 500MB
};

/**
 * ModelStorageService - Infrastructure service for ML model file storage
 * 
 * Handles:
 * - ML model file upload to local filesystem
 * - File validation (extension, size)
 * - File deletion
 */
export class ModelStorageService {
    private readonly config: ModelStorageConfig;

    constructor(config?: Partial<ModelStorageConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.ensureUploadDirExists();
    }

    /**
     * Ensure upload directory exists
     */
    private ensureUploadDirExists(): void {
        if (!fs.existsSync(this.config.uploadDir)) {
            fs.mkdirSync(this.config.uploadDir, { recursive: true });
        }
    }

    /**
     * Validate file before upload
     */
    private validateFile(file: ModelFileData): void {
        const ext = path.extname(file.originalName).toLowerCase();
        
        if (!this.config.allowedExtensions.includes(ext)) {
            throw new Error(`[ERROR][MODEL_STORAGE]: Invalid file type. Allowed: ${this.config.allowedExtensions.join(', ')}`);
        }
        if (file.size > this.config.maxFileSize) {
            throw new Error(`[ERROR][MODEL_STORAGE]: File too large. Max size: ${this.config.maxFileSize / 1024 / 1024}MB`);
        }
    }

    /**
     * Generate unique filename
     */
    private generateFileName(originalName: string, modelType: string, version: string): string {
        const ext = path.extname(originalName);
        const timestamp = Date.now();
        return `${modelType.toLowerCase()}_v${version}_${timestamp}${ext}`;
    }

    /**
     * Upload a model file
     */
    public async upload(file: ModelFileData, modelType: string, version: string): Promise<ModelUploadResult> {
        this.validateFile(file);

        const fileName = this.generateFileName(file.originalName, modelType, version);
        const filePath = path.join(this.config.uploadDir, fileName);

        await fs.promises.writeFile(filePath, file.buffer);

        return {
            fileName,
            filePath,
            size: file.size
        };
    }

    /**
     * Delete a model file by path
     */
    public async delete(filePath: string): Promise<boolean> {
        if (!fs.existsSync(filePath)) {
            return false;
        }

        await fs.promises.unlink(filePath);
        return true;
    }

    /**
     * Check if file exists
     */
    public exists(filePath: string): boolean {
        return fs.existsSync(filePath);
    }
}

// Singleton instance
const modelStorageService = new ModelStorageService();
export default modelStorageService;
