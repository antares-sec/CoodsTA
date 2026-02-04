import { Accuracy } from '../../../../src/module/domain/model/vo/Accuracy';

describe('Accuracy ValueObject', () => {
    describe('create', () => {
        it('should create accuracy with valid value', () => {
            const accuracy = Accuracy.create(85);

            expect(accuracy.value).toBe(85);
        });

        it('should create accuracy with 0', () => {
            const accuracy = Accuracy.create(0);

            expect(accuracy.value).toBe(0);
        });

        it('should create accuracy with 100', () => {
            const accuracy = Accuracy.create(100);

            expect(accuracy.value).toBe(100);
        });

        it('should create accuracy with decimal values', () => {
            const accuracy = Accuracy.create(85.5);

            expect(accuracy.value).toBe(85.5);
        });

        it('should throw error for negative accuracy', () => {
            expect(() => Accuracy.create(-1)).toThrow('[ERROR][ACCURACY]: Accuracy must be between 0 and 100. Received: -1');
        });

        it('should throw error for accuracy over 100', () => {
            expect(() => Accuracy.create(101)).toThrow('[ERROR][ACCURACY]: Accuracy must be between 0 and 100. Received: 101');
        });

        it('should throw error for Infinity', () => {
            expect(() => Accuracy.create(Infinity)).toThrow('[ERROR][ACCURACY]: Accuracy must be between 0 and 100');
        });

        it('should throw error for negative Infinity', () => {
            expect(() => Accuracy.create(-Infinity)).toThrow('[ERROR][ACCURACY]: Accuracy must be between 0 and 100');
        });

        it('should throw error for NaN', () => {
            expect(() => Accuracy.create(NaN)).toThrow('[ERROR][ACCURACY]: Accuracy must be a valid number.');
        });
    });

    describe('isHighAccuracy', () => {
        it('should return true for accuracy >= 90', () => {
            expect(Accuracy.create(90).isHighAccuracy()).toBe(true);
            expect(Accuracy.create(95).isHighAccuracy()).toBe(true);
            expect(Accuracy.create(100).isHighAccuracy()).toBe(true);
        });

        it('should return false for accuracy < 90', () => {
            expect(Accuracy.create(89).isHighAccuracy()).toBe(false);
            expect(Accuracy.create(70).isHighAccuracy()).toBe(false);
            expect(Accuracy.create(0).isHighAccuracy()).toBe(false);
        });
    });

    describe('isMediumAccuracy', () => {
        it('should return true for accuracy >= 70 and < 90', () => {
            expect(Accuracy.create(70).isMediumAccuracy()).toBe(true);
            expect(Accuracy.create(80).isMediumAccuracy()).toBe(true);
            expect(Accuracy.create(89).isMediumAccuracy()).toBe(true);
        });

        it('should return false for accuracy < 70', () => {
            expect(Accuracy.create(69).isMediumAccuracy()).toBe(false);
            expect(Accuracy.create(50).isMediumAccuracy()).toBe(false);
        });

        it('should return false for accuracy >= 90', () => {
            expect(Accuracy.create(90).isMediumAccuracy()).toBe(false);
            expect(Accuracy.create(100).isMediumAccuracy()).toBe(false);
        });
    });

    describe('isLowAccuracy', () => {
        it('should return true for accuracy < 70', () => {
            expect(Accuracy.create(69).isLowAccuracy()).toBe(true);
            expect(Accuracy.create(50).isLowAccuracy()).toBe(true);
            expect(Accuracy.create(0).isLowAccuracy()).toBe(true);
        });

        it('should return false for accuracy >= 70', () => {
            expect(Accuracy.create(70).isLowAccuracy()).toBe(false);
            expect(Accuracy.create(90).isLowAccuracy()).toBe(false);
            expect(Accuracy.create(100).isLowAccuracy()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for accuracies with same value', () => {
            const accuracy1 = Accuracy.create(85);
            const accuracy2 = Accuracy.create(85);

            expect(accuracy1.equals(accuracy2)).toBe(true);
        });

        it('should return false for accuracies with different values', () => {
            const accuracy1 = Accuracy.create(85);
            const accuracy2 = Accuracy.create(90);

            expect(accuracy1.equals(accuracy2)).toBe(false);
        });
    });

    describe('value getter', () => {
        it('should return the accuracy value', () => {
            const accuracy = Accuracy.create(75);
            expect(accuracy.value).toBe(75);
        });
    });
});
