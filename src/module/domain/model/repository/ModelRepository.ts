import { PrismaClient } from "../../../../../generated/prisma";
import { ModelMapper } from "../mapper/ModelMapper";
import { Model } from "../Model";

export class ModelRepository {
    constructor(private prisma: PrismaClient) {}

    async fetchAll(): Promise<Model[]> {
        const raw = await this.prisma.model.findMany();
        return ModelMapper.toDomainBulk(raw);
    }

    async findById(id: string): Promise<Model | null> {
        const raw = await this.prisma.model.findUnique({ where: { id } });
        return raw ? ModelMapper.toDomain(raw) : null;
    }

    async findActiveModels(): Promise<Model[]> {
        const raw = await this.prisma.model.findMany({
            where: { isActive: 'ACTIVE' }
        });
        return ModelMapper.toDomainBulk(raw);
    }

    async findByType(modelType: 'DETECTOR' | 'CLASSIFICATOR'): Promise<Model[]> {
        const raw = await this.prisma.model.findMany({
            where: { modelType }
        });
        return ModelMapper.toDomainBulk(raw);
    }

    async findActiveByType(modelType: 'DETECTOR' | 'CLASSIFICATOR'): Promise<Model | null> {
        const raw = await this.prisma.model.findFirst({
            where: { 
                modelType,
                isActive: 'ACTIVE'
            }
        });
        return raw ? ModelMapper.toDomain(raw) : null;
    }

    async save(model: Model): Promise<void> {
        const createData = ModelMapper.toPersistence(model);
        const updateData = ModelMapper.toUpdatePersistence(model);
        await this.prisma.model.upsert({
            where: { id: model.id },
            create: createData,
            update: updateData
        });
    }

    async delete(id: string): Promise<void> {
        const exists = await this.findById(id);
        if (!exists) {
            throw new Error(`[ERROR][MODEL]: MODEL WITH ID: ${id} NOT FOUND!`);
        }
        await this.prisma.model.delete({
            where: { id }
        });
    }
}
