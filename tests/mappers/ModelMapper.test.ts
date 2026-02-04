import { ModelMapper } from '../../src/module/domain/model/mapper/ModelMapper';
import { Model } from '../../src/module/domain/model/Model';

describe('ModelMapper', () => {
    const mockModel = Model.fromPersistence('model-123', {
        model_type: 'DETECTOR',
        version: '1.0.0',
        file_path: '/models/detector_v1.h5',
        accuracy: 95,
        deployment_date: new Date('2024-01-01'),
        created_at: new Date('2024-01-01'),
        is_active: 'ACTIVE'
    });

    const mockPrismaModel = {
        id: 'model-123',
        modelType: 'DETECTOR',
        version: '1.0.0',
        filePath: '/models/detector_v1.h5',
        accuracy: 95,
        deploymentDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        isActive: 'ACTIVE'
    };

    describe('toDomain', () => {
        it('should convert Prisma model to domain entity', () => {
            const model = ModelMapper.toDomain(mockPrismaModel as any);

            expect(model.id).toBe('model-123');
            expect(model.modelType).toBe('DETECTOR');
            expect(model.version).toBe('1.0.0');
            expect(model.filePath).toBe('/models/detector_v1.h5');
            expect(model.accuracy).toBe(95);
            expect(model.isActive).toBe('ACTIVE');
        });
    });

    describe('toPersistence', () => {
        it('should convert domain entity to Prisma create input', () => {
            const persistence = ModelMapper.toPersistence(mockModel);

            expect(persistence.id).toBe('model-123');
            expect(persistence.modelType).toBe('DETECTOR');
            expect(persistence.version).toBe('1.0.0');
            expect(persistence.filePath).toBe('/models/detector_v1.h5');
            expect(persistence.accuracy).toBe(95);
            expect(persistence.isActive).toBe('ACTIVE');
        });
    });

    describe('toUpdatePersistence', () => {
        it('should convert domain entity to Prisma update input', () => {
            const updateData = ModelMapper.toUpdatePersistence(mockModel);

            expect(updateData.modelType).toBe('DETECTOR');
            expect(updateData.version).toBe('1.0.0');
            expect(updateData.filePath).toBe('/models/detector_v1.h5');
            expect(updateData.accuracy).toBe(95);
            expect(updateData.isActive).toBe('ACTIVE');
            expect(updateData).not.toHaveProperty('id');
        });
    });

    describe('toDTO', () => {
        it('should convert domain entity to DTO', () => {
            const dto = ModelMapper.toDTO(mockModel);

            expect(dto.id).toBe('model-123');
            expect(dto.modelType).toBe('DETECTOR');
            expect(dto.version).toBe('1.0.0');
            expect(dto.filePath).toBe('/models/detector_v1.h5');
            expect(dto.accuracy).toBe(95);
            expect(dto.deploymentDate).toEqual(new Date('2024-01-01'));
            expect(dto.createdAt).toEqual(new Date('2024-01-01'));
            expect(dto.isActive).toBe('ACTIVE');
        });
    });

    describe('toDomainBulk', () => {
        it('should convert multiple Prisma models to domain entities', () => {
            const prismaModels = [
                mockPrismaModel,
                { ...mockPrismaModel, id: 'model-456', version: '2.0.0' }
            ];

            const models = ModelMapper.toDomainBulk(prismaModels as any);

            expect(models).toHaveLength(2);
            expect(models[0].id).toBe('model-123');
            expect(models[1].id).toBe('model-456');
        });

        it('should return empty array for empty input', () => {
            const models = ModelMapper.toDomainBulk([]);

            expect(models).toHaveLength(0);
        });
    });

    describe('toDTOBulk', () => {
        it('should convert multiple domain entities to DTOs', () => {
            const models = [
                mockModel,
                Model.fromPersistence('model-456', {
                    model_type: 'CLASSIFICATOR',
                    version: '2.0.0',
                    file_path: '/models/classificator_v2.h5',
                    accuracy: 88,
                    deployment_date: new Date(),
                    created_at: new Date(),
                    is_active: 'DEACTIVATED'
                })
            ];

            const dtos = ModelMapper.toDTOBulk(models);

            expect(dtos).toHaveLength(2);
            expect(dtos[0].id).toBe('model-123');
            expect(dtos[1].id).toBe('model-456');
        });

        it('should return empty array for empty input', () => {
            const dtos = ModelMapper.toDTOBulk([]);

            expect(dtos).toHaveLength(0);
        });
    });
});
