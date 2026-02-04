import { ReportMap } from '../../src/module/domain/report/mapper/ReportMap';
import { Report } from '../../src/module/domain/report/Report';

describe('ReportMap', () => {
    const mockReport = Report.fromPersistence('report-123', {
        user_id: 'user-123',
        product_id: 'product-123',
        authenticity_result: 'GENUINE',
        confidence_score: 95,
        created_at: new Date('2024-01-01'),
        image_path: '/uploads/report.jpg',
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
    });

    const mockPrismaReport = {
        id: 'report-123',
        userId: 'user-123',
        productId: 'product-123',
        authenticityResult: 'GENUINE',
        confidenceScore: 95,
        createdAt: new Date('2024-01-01'),
        imagePath: '/uploads/report.jpg',
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

    describe('toDomain', () => {
        it('should convert Prisma model to domain entity', () => {
            const report = ReportMap.toDomain(mockPrismaReport as any);

            expect(report.id).toBe('report-123');
            expect(report.userId).toBe('user-123');
            expect(report.productId).toBe('product-123');
            expect(report.authenticityResult).toBe('GENUINE');
            expect(report.confidenceScore).toBe(95);
        });

        it('should include product data', () => {
            const report = ReportMap.toDomain(mockPrismaReport as any);

            expect(report.product).toBeDefined();
            expect(report.product?.id).toBe('product-123');
            expect(report.product?.name).toBe('Test Jersey');
        });

        it('should include user data', () => {
            const report = ReportMap.toDomain(mockPrismaReport as any);

            expect(report.user).toBeDefined();
            expect(report.user?.id).toBe('user-123');
            expect(report.user?.name).toBe('John Doe');
        });

        it('should handle null product', () => {
            const prismaReport = { ...mockPrismaReport, product: null };
            const report = ReportMap.toDomain(prismaReport as any);

            expect(report.product).toBeNull();
        });

        it('should handle null user', () => {
            const prismaReport = { ...mockPrismaReport, user: null };
            const report = ReportMap.toDomain(prismaReport as any);

            expect(report.user).toBeNull();
        });

        it('should handle null user name', () => {
            const prismaReport = {
                ...mockPrismaReport,
                user: { ...mockPrismaReport.user, name: null }
            };
            const report = ReportMap.toDomain(prismaReport as any);

            expect(report.user?.name).toBe('');
        });
    });

    describe('toPersistence', () => {
        it('should convert domain entity to Prisma create input', () => {
            const persistence = ReportMap.toPersistence(mockReport);

            expect(persistence.id).toBe('report-123');
            expect(persistence.user).toEqual({ connect: { id: 'user-123' } });
            expect(persistence.product).toEqual({ connect: { id: 'product-123' } });
            expect(persistence.authenticityResult).toBe('GENUINE');
            expect(persistence.confidenceScore).toBe(95);
        });

        it('should handle null image path', () => {
            const report = Report.fromPersistence('report-123', {
                user_id: 'user-123',
                product_id: 'product-123',
                authenticity_result: 'GENUINE',
                confidence_score: 95,
                created_at: new Date(),
                image_path: null
            });

            const persistence = ReportMap.toPersistence(report);

            expect(persistence.imagePath).toBeNull();
        });
    });

    describe('toUpdatePersistence', () => {
        it('should convert domain entity to Prisma update input', () => {
            const updateData = ReportMap.toUpdatePersistence(mockReport);

            expect(updateData.authenticityResult).toBe('GENUINE');
            expect(updateData.confidenceScore).toBe(95);
            expect(updateData).not.toHaveProperty('id');
            expect(updateData).not.toHaveProperty('userId');
            expect(updateData).not.toHaveProperty('productId');
        });
    });

    describe('toDTO', () => {
        it('should convert domain entity to DTO', () => {
            const dto = ReportMap.toDTO(mockReport);

            expect(dto.id).toBe('report-123');
            expect(dto.userId).toBe('user-123');
            expect(dto.productId).toBe('product-123');
            expect(dto.authenticityResult).toBe('GENUINE');
            expect(dto.confidenceScore).toBe(95);
            expect(dto.createdAt).toEqual(new Date('2024-01-01'));
            expect(dto.imagePath).toBe('/uploads/report.jpg');
            expect(dto.product).toBeDefined();
            expect(dto.user).toBeDefined();
        });
    });

    describe('toDomainBulk', () => {
        it('should convert multiple Prisma models to domain entities', () => {
            const prismaReports = [
                mockPrismaReport,
                { ...mockPrismaReport, id: 'report-456' }
            ];

            const reports = ReportMap.toDomainBulk(prismaReports as any);

            expect(reports).toHaveLength(2);
            expect(reports[0].id).toBe('report-123');
            expect(reports[1].id).toBe('report-456');
        });

        it('should return empty array for empty input', () => {
            const reports = ReportMap.toDomainBulk([]);

            expect(reports).toHaveLength(0);
        });
    });

    describe('toDTOBulk', () => {
        it('should convert multiple domain entities to DTOs', () => {
            const reports = [
                mockReport,
                Report.fromPersistence('report-456', {
                    user_id: 'user-456',
                    product_id: 'product-456',
                    authenticity_result: 'COUNTERFEIT',
                    confidence_score: 85,
                    created_at: new Date()
                })
            ];

            const dtos = ReportMap.toDTOBulk(reports);

            expect(dtos).toHaveLength(2);
            expect(dtos[0].id).toBe('report-123');
            expect(dtos[1].id).toBe('report-456');
        });

        it('should return empty array for empty input', () => {
            const dtos = ReportMap.toDTOBulk([]);

            expect(dtos).toHaveLength(0);
        });
    });
});
