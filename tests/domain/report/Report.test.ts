import { Report } from '../../../src/module/domain/report/Report';

describe('Report Entity', () => {
    const validReportProps = {
        user_id: 'user-123',
        product_id: 'product-123',
        authenticity_result: 'GENUINE',
        confidence_score: 85,
        created_at: new Date('2024-01-01'),
        image_path: '/uploads/report-image.jpg',
        product: {
            id: 'product-123',
            name: 'Test Jersey',
            category: 'JERSEY',
            imagePath: '/uploads/jersey.jpg'
        },
        user: {
            id: 'user-123',
            name: 'John Doe',
            email: 'john@example.com'
        }
    };

    describe('create', () => {
        it('should create a valid report', () => {
            const report = Report.create('report-123', validReportProps);

            expect(report.id).toBe('report-123');
            expect(report.userId).toBe('user-123');
            expect(report.productId).toBe('product-123');
            expect(report.authenticityResult).toBe('GENUINE');
            expect(report.confidenceScore).toBe(85);
        });

        it('should throw error when id is empty', () => {
            expect(() => Report.create('', validReportProps)).toThrow('[ERROR][REPORT]: ID NOT FOUND');
        });

        it('should throw error when id is null', () => {
            expect(() => Report.create(null as any, validReportProps)).toThrow('[ERROR][REPORT]: ID NOT FOUND');
        });

        it('should throw error when id is undefined', () => {
            expect(() => Report.create(undefined as any, validReportProps)).toThrow('[ERROR][REPORT]: ID NOT FOUND');
        });

        it('should throw error for invalid authenticity_result', () => {
            expect(() => Report.create('report-123', {
                ...validReportProps,
                authenticity_result: 'INVALID'
            })).toThrow('[ERROR][AUTHENTICITY]: INVALID AUTHENTICITY TYPE');
        });

        it('should throw error for invalid confidence_score', () => {
            expect(() => Report.create('report-123', {
                ...validReportProps,
                confidence_score: 150
            })).toThrow('[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100');
        });

        it('should create report with COUNTERFEIT result', () => {
            const report = Report.create('report-123', {
                ...validReportProps,
                authenticity_result: 'COUNTERFEIT'
            });

            expect(report.authenticityResult).toBe('COUNTERFEIT');
        });

        it('should handle optional image_path as null', () => {
            const report = Report.create('report-123', {
                ...validReportProps,
                image_path: null
            });

            expect(report.imagePath).toBeNull();
        });

        it('should handle optional product as null', () => {
            const report = Report.create('report-123', {
                ...validReportProps,
                product: null
            });

            expect(report.product).toBeNull();
        });

        it('should handle optional user as null', () => {
            const report = Report.create('report-123', {
                ...validReportProps,
                user: null
            });

            expect(report.user).toBeNull();
        });

        it('should create report without optional fields', () => {
            const report = Report.create('report-123', {
                user_id: 'user-123',
                product_id: 'product-123',
                authenticity_result: 'GENUINE',
                confidence_score: 85,
                created_at: new Date()
            });

            expect(report.imagePath).toBeUndefined();
            expect(report.product).toBeUndefined();
            expect(report.user).toBeUndefined();
        });
    });

    describe('fromPersistence', () => {
        it('should create report from persistence', () => {
            const report = Report.fromPersistence('report-123', validReportProps);

            expect(report.id).toBe('report-123');
            expect(report.userId).toBe('user-123');
            expect(report.productId).toBe('product-123');
        });
    });

    describe('getters', () => {
        let report: Report;

        beforeEach(() => {
            report = Report.create('report-123', validReportProps);
        });

        it('should return id', () => {
            expect(report.id).toBe('report-123');
        });

        it('should return userId', () => {
            expect(report.userId).toBe('user-123');
        });

        it('should return productId', () => {
            expect(report.productId).toBe('product-123');
        });

        it('should return authenticityResult', () => {
            expect(report.authenticityResult).toBe('GENUINE');
        });

        it('should return authentictyResult (legacy getter)', () => {
            expect(report.authentictyResult).toBe('GENUINE');
        });

        it('should return authentictyResultVO', () => {
            expect(report.authentictyResultVO.value).toBe('GENUINE');
            expect(report.authentictyResultVO.isGenuine()).toBe(true);
        });

        it('should return confidenceScore', () => {
            expect(report.confidenceScore).toBe(85);
        });

        it('should return confidenceScoreVO', () => {
            expect(report.confidenceScoreVO.value).toBe(85);
            expect(report.confidenceScoreVO.isHighConfidence()).toBe(true);
        });

        it('should return createdAt', () => {
            expect(report.createdAt).toEqual(new Date('2024-01-01'));
        });

        it('should return imagePath', () => {
            expect(report.imagePath).toBe('/uploads/report-image.jpg');
        });

        it('should return product', () => {
            expect(report.product).toEqual({
                id: 'product-123',
                name: 'Test Jersey',
                category: 'JERSEY',
                imagePath: '/uploads/jersey.jpg'
            });
        });

        it('should return user', () => {
            expect(report.user).toEqual({
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com'
            });
        });
    });

    describe('equals', () => {
        it('should return true for reports with same id', () => {
            const report1 = Report.create('report-123', validReportProps);
            const report2 = Report.create('report-123', { ...validReportProps, confidence_score: 90 });

            expect(report1.equals(report2)).toBe(true);
        });

        it('should return false for reports with different ids', () => {
            const report1 = Report.create('report-123', validReportProps);
            const report2 = Report.create('report-456', validReportProps);

            expect(report1.equals(report2)).toBe(false);
        });
    });
});
