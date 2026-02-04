import { ModelRepository } from "../../domain/model/repository/ModelRepository";
import { ModelStorageService, ModelFileData } from "../../infrastructure/storage/ModelStorageService";
import { Model } from "../../domain/model/Model";
import { ModelMapper } from "../../domain/model/mapper/ModelMapper";
import { randomUUID } from "crypto";

interface UploadModelDTO {
    modelType: 'DETECTOR' | 'CLASSIFICATOR';
    version: string;
    accuracy: number;
    file: ModelFileData;
    isActive?: boolean;
}

interface UploadModelResponse {
    success: boolean;
    message: string;
    model?: {
        id: string;
        modelType: string;
        version: string;
        filePath: string;
        accuracy: number;
        deploymentDate: Date;
        createdAt: Date;
        isActive: string;
    };
}

/**
 * UploadModelUsecase - Application service for ML model upload
 * 
 * Handles:
 * - Model file upload
 * - Model entity creation
 * - Deactivate previous active model of same type (if new is active)
 * - Persistence to database
 */
export class UploadModelUsecase {
    constructor(
        private readonly modelRepository: ModelRepository,
        private readonly modelStorageService: ModelStorageService
    ) {}

    async execute(dto: UploadModelDTO): Promise<UploadModelResponse> {
        // Validate input
        if (!dto.modelType) {
            throw new Error('[ERROR][UPLOAD_MODEL]: Model type is required');
        }
        if (!dto.version || dto.version.trim().length === 0) {
            throw new Error('[ERROR][UPLOAD_MODEL]: Version is required');
        }
        if (dto.accuracy === undefined || dto.accuracy === null) {
            throw new Error('[ERROR][UPLOAD_MODEL]: Accuracy is required');
        }
        if (!dto.file) {
            throw new Error('[ERROR][UPLOAD_MODEL]: Model file is required');
        }

        // Upload model file
        const uploadResult = await this.modelStorageService.upload(
            dto.file, 
            dto.modelType, 
            dto.version
        );

        try {
            // If new model should be active, deactivate current active model of same type
            if (dto.isActive !== false) {
                const currentActive = await this.modelRepository.findActiveByType(dto.modelType);
                if (currentActive) {
                    const deactivatedModel = Model.create(currentActive.id, {
                        model_type: currentActive.modelType,
                        version: currentActive.version,
                        file_path: currentActive.filePath,
                        accuracy: currentActive.accuracy,
                        deployment_date: currentActive.deploymentDate,
                        created_at: currentActive.createdAt,
                        is_active: 'DEACTIVATED'
                    });
                    await this.modelRepository.save(deactivatedModel);
                }
            }

            // Create model entity
            const now = new Date();
            const model = Model.create(randomUUID(), {
                model_type: dto.modelType,
                version: dto.version.trim(),
                file_path: uploadResult.filePath,
                accuracy: dto.accuracy,
                deployment_date: now,
                created_at: now,
                is_active: dto.isActive !== false ? 'ACTIVE' : 'DEACTIVATED'
            });

            // Save model
            await this.modelRepository.save(model);

            // Return response
            const modelDTO = ModelMapper.toDTO(model);

            return {
                success: true,
                message: "Model uploaded successfully",
                model: modelDTO
            };
        } catch (error) {
            // Cleanup: delete uploaded file if model creation fails
            await this.modelStorageService.delete(uploadResult.filePath);
            throw error;
        }
    }
}
