import { ConfidenceScore } from '../../../../src/module/domain/report/vo/ConfidenceScore';

describe('ConfidenceScore ValueObject', () => {
    describe('create', () => {
        it('should create confidence score with valid value', () => {
            const score = ConfidenceScore.create(85);

            expect(score.value).toBe(85);
        });

        it('should create confidence score with 0', () => {
            const score = ConfidenceScore.create(0);

            expect(score.value).toBe(0);
        });

        it('should create confidence score with 100', () => {
            const score = ConfidenceScore.create(100);

            expect(score.value).toBe(100);
        });

        it('should create confidence score with decimal values', () => {
            const score = ConfidenceScore.create(85.5);

            expect(score.value).toBe(85.5);
        });

        it('should throw error for negative score', () => {
            expect(() => ConfidenceScore.create(-1)).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100. Received: -1');
        });

        it('should throw error for score over 100', () => {
            expect(() => ConfidenceScore.create(101)).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100. Received: 101');
        });

        it('should throw error for Infinity', () => {
            expect(() => ConfidenceScore.create(Infinity)).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100');
        });

        it('should throw error for negative Infinity', () => {
            expect(() => ConfidenceScore.create(-Infinity)).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100');
        });

        it('should throw error for NaN', () => {
            expect(() => ConfidenceScore.create(NaN)).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be a valid number.');
        });
    });

    describe('isHighConfidence', () => {
        it('should return true for score >= 80', () => {
            expect(ConfidenceScore.create(80).isHighConfidence()).toBe(true);
            expect(ConfidenceScore.create(90).isHighConfidence()).toBe(true);
            expect(ConfidenceScore.create(100).isHighConfidence()).toBe(true);
        });

        it('should return false for score < 80', () => {
            expect(ConfidenceScore.create(79).isHighConfidence()).toBe(false);
            expect(ConfidenceScore.create(50).isHighConfidence()).toBe(false);
            expect(ConfidenceScore.create(0).isHighConfidence()).toBe(false);
        });
    });

    describe('isMediumConfidence', () => {
        it('should return true for score >= 50 and < 80', () => {
            expect(ConfidenceScore.create(50).isMediumConfidence()).toBe(true);
            expect(ConfidenceScore.create(65).isMediumConfidence()).toBe(true);
            expect(ConfidenceScore.create(79).isMediumConfidence()).toBe(true);
        });

        it('should return false for score < 50', () => {
            expect(ConfidenceScore.create(49).isMediumConfidence()).toBe(false);
            expect(ConfidenceScore.create(25).isMediumConfidence()).toBe(false);
        });

        it('should return false for score >= 80', () => {
            expect(ConfidenceScore.create(80).isMediumConfidence()).toBe(false);
            expect(ConfidenceScore.create(100).isMediumConfidence()).toBe(false);
        });
    });

    describe('isLowConfidence', () => {
        it('should return true for score < 50', () => {
            expect(ConfidenceScore.create(49).isLowConfidence()).toBe(true);
            expect(ConfidenceScore.create(25).isLowConfidence()).toBe(true);
            expect(ConfidenceScore.create(0).isLowConfidence()).toBe(true);
        });

        it('should return false for score >= 50', () => {
            expect(ConfidenceScore.create(50).isLowConfidence()).toBe(false);
            expect(ConfidenceScore.create(80).isLowConfidence()).toBe(false);
            expect(ConfidenceScore.create(100).isLowConfidence()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for scores with same value', () => {
            const score1 = ConfidenceScore.create(85);
            const score2 = ConfidenceScore.create(85);

            expect(score1.equals(score2)).toBe(true);
        });

        it('should return false for scores with different values', () => {
            const score1 = ConfidenceScore.create(85);
            const score2 = ConfidenceScore.create(90);

            expect(score1.equals(score2)).toBe(false);
        });
    });

    describe('value getter', () => {
        it('should return the confidence score value', () => {
            const score = ConfidenceScore.create(75);
            expect(score.value).toBe(75);
        });
    });
});
