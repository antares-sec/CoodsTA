import { ModelType } from '../../../../src/module/domain/model/vo/ModelType';

describe('ModelType ValueObject', () => {
    describe('create', () => {
        it('should create DETECTOR type', () => {
            const type = ModelType.create('DETECTOR');

            expect(type.value).toBe('DETECTOR');
        });

        it('should create CLASSIFICATOR type', () => {
            const type = ModelType.create('CLASSIFICATOR');

            expect(type.value).toBe('CLASSIFICATOR');
        });

        it('should handle lowercase input for DETECTOR', () => {
            const type = ModelType.create('detector');

            expect(type.value).toBe('DETECTOR');
        });

        it('should handle lowercase input for CLASSIFICATOR', () => {
            const type = ModelType.create('classificator');

            expect(type.value).toBe('CLASSIFICATOR');
        });

        it('should handle mixed case input', () => {
            const type = ModelType.create('DeTeCtoR');

            expect(type.value).toBe('DETECTOR');
        });

        it('should throw error for invalid type', () => {
            expect(() => ModelType.create('ANALYZER')).toThrow('[ERROR][MODEL_TYPE]: Invalid model type. Must be DETECTOR or CLASSIFICATOR.');
        });

        it('should throw error for empty type', () => {
            expect(() => ModelType.create('')).toThrow();
        });

        it('should throw error for random string', () => {
            expect(() => ModelType.create('neural')).toThrow('[ERROR][MODEL_TYPE]: Invalid model type. Must be DETECTOR or CLASSIFICATOR.');
        });
    });

    describe('static factory methods', () => {
        describe('detector', () => {
            it('should create DETECTOR type', () => {
                const type = ModelType.detector();

                expect(type.value).toBe('DETECTOR');
            });

            it('should return isDetector true', () => {
                const type = ModelType.detector();

                expect(type.isDetector()).toBe(true);
                expect(type.isClassificator()).toBe(false);
            });
        });

        describe('classificator', () => {
            it('should create CLASSIFICATOR type', () => {
                const type = ModelType.classificator();

                expect(type.value).toBe('CLASSIFICATOR');
            });

            it('should return isClassificator true', () => {
                const type = ModelType.classificator();

                expect(type.isClassificator()).toBe(true);
                expect(type.isDetector()).toBe(false);
            });
        });
    });

    describe('isDetector', () => {
        it('should return true for DETECTOR type', () => {
            const type = ModelType.create('DETECTOR');

            expect(type.isDetector()).toBe(true);
        });

        it('should return false for CLASSIFICATOR type', () => {
            const type = ModelType.create('CLASSIFICATOR');

            expect(type.isDetector()).toBe(false);
        });
    });

    describe('isClassificator', () => {
        it('should return true for CLASSIFICATOR type', () => {
            const type = ModelType.create('CLASSIFICATOR');

            expect(type.isClassificator()).toBe(true);
        });

        it('should return false for DETECTOR type', () => {
            const type = ModelType.create('DETECTOR');

            expect(type.isClassificator()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for types with same value', () => {
            const type1 = ModelType.create('DETECTOR');
            const type2 = ModelType.create('DETECTOR');

            expect(type1.equals(type2)).toBe(true);
        });

        it('should return true for types created with different cases', () => {
            const type1 = ModelType.create('detector');
            const type2 = ModelType.create('DETECTOR');

            expect(type1.equals(type2)).toBe(true);
        });

        it('should return false for different types', () => {
            const type1 = ModelType.create('DETECTOR');
            const type2 = ModelType.create('CLASSIFICATOR');

            expect(type1.equals(type2)).toBe(false);
        });

        it('should return true for factory created types with same value', () => {
            const type1 = ModelType.detector();
            const type2 = ModelType.detector();

            expect(type1.equals(type2)).toBe(true);
        });

        it('should return true for factory and create with same type', () => {
            const type1 = ModelType.classificator();
            const type2 = ModelType.create('CLASSIFICATOR');

            expect(type1.equals(type2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the type value', () => {
            const type = ModelType.create('DETECTOR');
            expect(type.value).toBe('DETECTOR');
        });
    });
});
