import { Model } from "../Model";
import { Prisma, Model as ModelModel } from "../../../../../generated/prisma";

type ModelCreateInput = Prisma.ModelCreateInput;
type ModelUpdateInput = Prisma.ModelUpdateInput;

interface ModelDTO {
    id: string;
    modelType: string;
    version: string;
    filePath: string;
    accuracy: number;
    deploymentDate: Date;
    createdAt: Date;
    isActive: string;
}

/**
 * ModelMapper - Mapper class for Model entity
 * 
 * Handles transformations between:
 * - Domain Entity (Model)
 * - Persistence Model (Prisma ModelModel)
 * - DTO (Data Transfer Object for API responses)
 */
export class ModelMapper {
    public static toDomain(raw: ModelModel): Model {
        return Model.fromPersistence(raw.id, {
            model_type: raw.modelType,
            version: raw.version,
            file_path: raw.filePath,
            accuracy: raw.accuracy,
            deployment_date: raw.deploymentDate,
            created_at: raw.createdAt,
            is_active: raw.isActive
        });
    }

    public static toPersistence(model: Model): ModelCreateInput {
        return {
            id: model.id,
            modelType: model.modelType as any,
            version: model.version,
            filePath: model.filePath,
            accuracy: model.accuracy,
            deploymentDate: model.deploymentDate,
            createdAt: model.createdAt,
            isActive: model.isActive as any
        };
    }

    public static toUpdatePersistence(model: Model): ModelUpdateInput {
        return {
            modelType: model.modelType as any,
            version: model.version,
            filePath: model.filePath,
            accuracy: model.accuracy,
            deploymentDate: model.deploymentDate,
            isActive: model.isActive as any
        };
    }

    public static toDTO(model: Model): ModelDTO {
        return {
            id: model.id,
            modelType: model.modelType,
            version: model.version,
            filePath: model.filePath,
            accuracy: model.accuracy,
            deploymentDate: model.deploymentDate,
            createdAt: model.createdAt,
            isActive: model.isActive
        };
    }

    public static toDomainBulk(rawModels: ModelModel[]): Model[] {
        return rawModels.map(raw => this.toDomain(raw));
    }

    public static toDTOBulk(models: Model[]): ModelDTO[] {
        return models.map(model => this.toDTO(model));
    }
}
