import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Buffer } from 'buffer';

export interface FileData {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    size: number;
}

export interface UploadResult {
    fileName: string;
    filePath: string;
    url: string;
    size: number;
}

export interface StorageConfig {
    uploadDir: string;
    baseUrl: string;
    allowedMimeTypes: string[];
    maxFileSize: number; // in bytes
}

const DEFAULT_CONFIG: StorageConfig = {
    uploadDir: './uploads',
    baseUrl: '/uploads',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024 // 5MB
};

/**
 * StorageService - Infrastructure service for file storage
 * 
 * Handles:
 * - File upload to local filesystem
 * - File validation (type, size)
 * - File deletion
 * - URL generation
 */
export class StorageService {
    private readonly config: StorageConfig;

    constructor(config?: Partial<StorageConfig>) {
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
    private validateFile(file: FileData): void {
        if (!this.config.allowedMimeTypes.includes(file.mimeType)) {
            throw new Error(`[ERROR][STORAGE]: Invalid file type. Allowed: ${this.config.allowedMimeTypes.join(', ')}`);
        }
        if (file.size > this.config.maxFileSize) {
            throw new Error(`[ERROR][STORAGE]: File too large. Max size: ${this.config.maxFileSize / 1024 / 1024}MB`);
        }
    }

    /**
     * Generate unique filename
     */
    private generateFileName(originalName: string): string {
        const ext = path.extname(originalName);
        const timestamp = Date.now();
        const uuid = randomUUID().split('-')[0];
        return `${timestamp}-${uuid}${ext}`;
    }

    /**
     * Upload a file
     */
    public async upload(file: FileData): Promise<UploadResult> {
        this.validateFile(file);

        const fileName = this.generateFileName(file.originalName);
        const filePath = path.join(this.config.uploadDir, fileName);

        await fs.promises.writeFile(filePath, file.buffer);

        return {
            fileName,
            filePath,
            url: `${this.config.baseUrl}/${fileName}`,
            size: file.size
        };
    }

    /**
     * Upload multiple files
     */
    public async uploadMany(files: FileData[]): Promise<UploadResult[]> {
        return Promise.all(files.map(file => this.upload(file)));
    }

    /**
     * Delete a file by filename
     */
    public async delete(fileName: string): Promise<boolean> {
        const filePath = path.join(this.config.uploadDir, fileName);
        
        if (!fs.existsSync(filePath)) {
            return false;
        }

        await fs.promises.unlink(filePath);
        return true;
    }

    /**
     * Delete file by URL
     */
    public async deleteByUrl(url: string): Promise<boolean> {
        const fileName = path.basename(url);
        return this.delete(fileName);
    }

    /**
     * Check if file exists
     */
    public exists(fileName: string): boolean {
        const filePath = path.join(this.config.uploadDir, fileName);
        return fs.existsSync(filePath);
    }

    /**
     * Get file path from URL
     */
    public getFilePath(url: string): string {
        const fileName = path.basename(url);
        return path.join(this.config.uploadDir, fileName);
    }
}

// Singleton instance
const storageService = new StorageService();
export default storageService;
