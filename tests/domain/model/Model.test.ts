import { Model } from '../../../src/module/domain/model/Model';

describe('Model Entity', () => {
    const validModelProps = {
        model_type: 'DETECTOR',
        version: '1.0.0',
        file_path: '/models/detector_v1.0.0.h5',
        accuracy: 95,
        deployment_date: new Date('2024-01-01'),
        created_at: new Date('2024-01-01'),
        is_active: 'ACTIVE'
    };

    describe('create', () => {
        it('should create a valid model', () => {
            const model = Model.create('model-123', validModelProps);

            expect(model.id).toBe('model-123');
            expect(model.modelType).toBe('DETECTOR');
            expect(model.version).toBe('1.0.0');
            expect(model.filePath).toBe('/models/detector_v1.0.0.h5');
            expect(model.accuracy).toBe(95);
            expect(model.isActive).toBe('ACTIVE');
        });

        it('should throw error when id is empty', () => {
            expect(() => Model.create('', validModelProps)).toThrow('[ERROR][MODEL]: ID NOT FOUND');
        });

        it('should throw error when id is null', () => {
            expect(() => Model.create(null as any, validModelProps)).toThrow('[ERROR][MODEL]: ID NOT FOUND');
        });

        it('should throw error when id is undefined', () => {
            expect(() => Model.create(undefined as any, validModelProps)).toThrow('[ERROR][MODEL]: ID NOT FOUND');
        });

        it('should throw error when version is empty', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                version: ''
            })).toThrow('[ERROR][MODEL]: VERSION IS REQUIRED');
        });

        it('should throw error when version is null', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                version: null as any
            })).toThrow('[ERROR][MODEL]: VERSION IS REQUIRED');
        });

        it('should throw error when version is whitespace only', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                version: '   '
            })).toThrow('[ERROR][MODEL]: VERSION IS REQUIRED');
        });

        it('should throw error when file_path is empty', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                file_path: ''
            })).toThrow('[ERROR][MODEL]: FILE PATH IS REQUIRED');
        });

        it('should throw error when file_path is null', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                file_path: null as any
            })).toThrow('[ERROR][MODEL]: FILE PATH IS REQUIRED');
        });

        it('should throw error when file_path is whitespace only', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                file_path: '   '
            })).toThrow('[ERROR][MODEL]: FILE PATH IS REQUIRED');
        });

        it('should throw error for invalid model_type', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                model_type: 'INVALID'
            })).toThrow('[ERROR][MODEL_TYPE]: Invalid model type. Must be DETECTOR or CLASSIFICATOR.');
        });

        it('should throw error for invalid accuracy', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                accuracy: 150
            })).toThrow('[ERROR][ACCURACY]: Accuracy must be between 0 and 100');
        });

        it('should throw error for invalid is_active', () => {
            expect(() => Model.create('model-123', {
                ...validModelProps,
                is_active: 'INVALID'
            })).toThrow('[ERROR][MODEL_STATUS]: Invalid status. Must be ACTIVE or DEACTIVATED.');
        });

        it('should create model with CLASSIFICATOR type', () => {
            const model = Model.create('model-123', {
                ...validModelProps,
                model_type: 'CLASSIFICATOR'
            });

            expect(model.modelType).toBe('CLASSIFICATOR');
        });

        it('should create model with DEACTIVATED status', () => {
            const model = Model.create('model-123', {
                ...validModelProps,
                is_active: 'DEACTIVATED'
            });

            expect(model.isActive).toBe('DEACTIVATED');
        });
    });

    describe('fromPersistence', () => {
        it('should create model from persistence', () => {
            const model = Model.fromPersistence('model-123', validModelProps);

            expect(model.id).toBe('model-123');
            expect(model.modelType).toBe('DETECTOR');
            expect(model.version).toBe('1.0.0');
        });
    });

    describe('getters', () => {
        let model: Model;

        beforeEach(() => {
            model = Model.create('model-123', validModelProps);
        });

        it('should return id', () => {
            expect(model.id).toBe('model-123');
        });

        it('should return modelType', () => {
            expect(model.modelType).toBe('DETECTOR');
        });

        it('should return modelTypeVO', () => {
            expect(model.modelTypeVO.value).toBe('DETECTOR');
            expect(model.modelTypeVO.isDetector()).toBe(true);
        });

        it('should return version', () => {
            expect(model.version).toBe('1.0.0');
        });

        it('should return filePath', () => {
            expect(model.filePath).toBe('/models/detector_v1.0.0.h5');
        });

        it('should return accuracy', () => {
            expect(model.accuracy).toBe(95);
        });

        it('should return accuracyVO', () => {
            expect(model.accuracyVO.value).toBe(95);
            expect(model.accuracyVO.isHighAccuracy()).toBe(true);
        });

        it('should return deploymentDate', () => {
            expect(model.deploymentDate).toEqual(new Date('2024-01-01'));
        });

        it('should return createdAt', () => {
            expect(model.createdAt).toEqual(new Date('2024-01-01'));
        });

        it('should return isActive', () => {
            expect(model.isActive).toBe('ACTIVE');
        });

        it('should return isActiveVO', () => {
            expect(model.isActiveVO.value).toBe('ACTIVE');
            expect(model.isActiveVO.isActive()).toBe(true);
        });
    });

    describe('isModelActive', () => {
        it('should return true for active model', () => {
            const model = Model.create('model-123', validModelProps);

            expect(model.isModelActive()).toBe(true);
        });

        it('should return false for deactivated model', () => {
            const model = Model.create('model-123', {
                ...validModelProps,
                is_active: 'DEACTIVATED'
            });

            expect(model.isModelActive()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for models with same id', () => {
            const model1 = Model.create('model-123', validModelProps);
            const model2 = Model.create('model-123', { ...validModelProps, version: '2.0.0' });

            expect(model1.equals(model2)).toBe(true);
        });

        it('should return false for models with different ids', () => {
            const model1 = Model.create('model-123', validModelProps);
            const model2 = Model.create('model-456', validModelProps);

            expect(model1.equals(model2)).toBe(false);
        });
    });
});
