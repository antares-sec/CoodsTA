import { ProductRepository } from "../../domain/product/repository/ProductRepository";
import { StorageService, FileData } from "../../infrastructure/storage/StorageService";
import { Product } from "../../domain/product/Product";
import { ProductMap } from "../../domain/product/mapper/ProductMap";
import { randomUUID } from "crypto";

interface UploadProductDTO {
    name: string;
    category: string;
    image: FileData;
}

interface UploadProductResponse {
    success: boolean;
    message: string;
    product?: {
        id: string;
        name: string;
        category: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

/**
 * UploadProductUsecase - Application service for product creation with image upload
 * 
 * Handles:
 * - Image file upload
 * - Product entity creation
 * - Persistence to database
 */
export class UploadProductUsecase {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly storageService: StorageService
    ) {}

    async execute(dto: UploadProductDTO): Promise<UploadProductResponse> {
        // Validate input
        if (!dto.name || dto.name.trim().length === 0) {
            throw new Error('[ERROR][UPLOAD_PRODUCT]: Product name is required');
        }
        if (!dto.category || dto.category.trim().length === 0) {
            throw new Error('[ERROR][UPLOAD_PRODUCT]: Category is required');
        }
        if (!dto.image) {
            throw new Error('[ERROR][UPLOAD_PRODUCT]: Image is required');
        }

        // Upload image
        const uploadResult = await this.storageService.upload(dto.image);

        try {
            // Create product entity
            const now = new Date();
            const product = Product.create(randomUUID(), {
                name: dto.name.trim(),
                category: dto.category.toUpperCase(),
                image_url: uploadResult.url,
                created_at: now,
                updated_at: now
            });

            // Save product
            await this.productRepository.save(product);

            // Return response
            const productDTO = ProductMap.toDTO(product);

            return {
                success: true,
                message: "Product uploaded successfully",
                product: productDTO
            };
        } catch (error) {
            // Cleanup: delete uploaded file if product creation fails
            await this.storageService.deleteByUrl(uploadResult.url);
            throw error;
        }
    }
}
