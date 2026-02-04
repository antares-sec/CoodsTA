import { ReportController } from '../../../src/module/interface/controllers/ReportController';
import { SaveReportUsecase } from '../../../src/module/applications/report/SaveReportUsecase';
import { ReportRepository } from '../../../src/module/domain/report/repository/ReportRepository';
import { Report } from '../../../src/module/domain/report/Report';
import { HttpRequest } from '../../../src/module/interface/http/HttpTypes';

describe('ReportController', () => {
    let reportController: ReportController;
    let mockSaveReportUsecase: jest.Mocked<SaveReportUsecase>;
    let mockReportRepository: jest.Mocked<ReportRepository>;

    const mockReport = Report.fromPersistence('report-123', {
        user_id: 'user-123',
        product_id: 'product-123',
        authenticity_result: 'GENUINE',
        confidence_score: 95,
        created_at: new Date()
    });

    beforeEach(() => {
        mockSaveReportUsecase = {
            execute: jest.fn()
        } as any;

        mockReportRepository = {
            fetchAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            deleteReport: jest.fn(),
            count: jest.fn(),
            countByResult: jest.fn(),
            getRecentScans: jest.fn()
        } as any;

        reportController = new ReportController(mockSaveReportUsecase, mockReportRepository);
    });

    describe('saveReport', () => {
        it('should return 201 for successful report save', async () => {
            mockSaveReportUsecase.execute.mockResolvedValue({
                success: true,
                message: 'Report saved successfully',
                report: {
                    id: 'report-123',
                    userId: 'user-123',
                    productId: 'product-123',
                    authenticityResult: 'GENUINE',
                    confidenceScore: 95,
                    createdAt: new Date()
                }
            });

            const request: HttpRequest = {
                body: {
                    productId: 'product-123',
                    authenticityResult: 'GENUINE',
                    confidenceScore: 95
                },
                params: {},
                query: {},
                headers: { method: 'POST' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.saveReport(request);

            expect(response.statusCode).toBe(201);
        });

        it('should return 401 if user is not authenticated', async () => {
            const request: HttpRequest = {
                body: {
                    productId: 'product-123',
                    authenticityResult: 'GENUINE',
                    confidenceScore: 95
                },
                params: {},
                query: {},
                headers: { method: 'POST' }
            };

            const response = await reportController.saveReport(request);

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Authentication required');
        });

        it('should return 400 for validation errors', async () => {
            mockSaveReportUsecase.execute.mockRejectedValue(
                new Error('[ERROR][SAVE_REPORT]: Product ID is required')
            );

            const request: HttpRequest = {
                body: {
                    productId: '',
                    authenticityResult: 'GENUINE',
                    confidenceScore: 95
                },
                params: {},
                query: {},
                headers: { method: 'POST' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.saveReport(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Product ID is required');
        });
    });

    describe('getUserReports', () => {
        it('should return 200 with user reports', async () => {
            mockReportRepository.fetchAll.mockResolvedValue([mockReport]);

            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.getUserReports(request);

            expect(response.statusCode).toBe(200);
        });

        it('should return 401 if user is not authenticated', async () => {
            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'GET' }
            };

            const response = await reportController.getUserReports(request);

            expect(response.statusCode).toBe(401);
        });

        it('should call fetchAll with user ID', async () => {
            mockReportRepository.fetchAll.mockResolvedValue([]);

            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            await reportController.getUserReports(request);

            expect(mockReportRepository.fetchAll).toHaveBeenCalledWith('user-123');
        });
    });

    describe('getReportById', () => {
        it('should return 200 for existing report owned by user', async () => {
            mockReportRepository.findById.mockResolvedValue(mockReport);

            const request: HttpRequest = {
                body: {},
                params: { id: 'report-123' },
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(200);
        });

        it('should return 401 if user is not authenticated', async () => {
            const request: HttpRequest = {
                body: {},
                params: { id: 'report-123' },
                query: {},
                headers: { method: 'GET' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(401);
        });

        it('should return 400 if report ID is missing', async () => {
            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Report ID is required');
        });

        it('should return 404 if report not found', async () => {
            mockReportRepository.findById.mockResolvedValue(null);

            const request: HttpRequest = {
                body: {},
                params: { id: 'nonexistent-report' },
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Report not found');
        });

        it('should return 401 if user does not own the report', async () => {
            const otherUserReport = Report.fromPersistence('report-123', {
                user_id: 'other-user',
                product_id: 'product-123',
                authenticity_result: 'GENUINE',
                confidence_score: 95,
                created_at: new Date()
            });
            mockReportRepository.findById.mockResolvedValue(otherUserReport);

            const request: HttpRequest = {
                body: {},
                params: { id: 'report-123' },
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Access denied');
        });

        it('should allow admin to access any report', async () => {
            const otherUserReport = Report.fromPersistence('report-123', {
                user_id: 'other-user',
                product_id: 'product-123',
                authenticity_result: 'GENUINE',
                confidence_score: 95,
                created_at: new Date()
            });
            mockReportRepository.findById.mockResolvedValue(otherUserReport);

            const request: HttpRequest = {
                body: {},
                params: { id: 'report-123' },
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'admin-123', email: 'admin@example.com', role: 'ADMIN' }
            };

            const response = await reportController.getReportById(request);

            expect(response.statusCode).toBe(200);
        });
    });

    describe('handle', () => {
        it('should route POST to saveReport', async () => {
            mockSaveReportUsecase.execute.mockResolvedValue({
                success: true,
                message: 'Report saved',
                report: { id: 'report-123', userId: 'user-123', productId: 'product-123', authenticityResult: 'GENUINE', confidenceScore: 95, createdAt: new Date() }
            });

            const request: HttpRequest = {
                body: { productId: 'product-123', authenticityResult: 'GENUINE', confidenceScore: 95 },
                params: {},
                query: {},
                headers: { method: 'POST' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.handle(request);

            expect(response.statusCode).toBe(201);
        });

        it('should route GET with id to getReportById', async () => {
            mockReportRepository.findById.mockResolvedValue(mockReport);

            const request: HttpRequest = {
                body: {},
                params: { id: 'report-123' },
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.handle(request);

            expect(mockReportRepository.findById).toHaveBeenCalledWith('report-123');
        });

        it('should route GET without id to getUserReports', async () => {
            mockReportRepository.fetchAll.mockResolvedValue([]);

            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'GET' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.handle(request);

            expect(mockReportRepository.fetchAll).toHaveBeenCalledWith('user-123');
        });

        it('should return 400 for unsupported method', async () => {
            const request: HttpRequest = {
                body: {},
                params: {},
                query: {},
                headers: { method: 'DELETE' },
                user: { userId: 'user-123', email: 'test@example.com', role: 'USER' }
            };

            const response = await reportController.handle(request);

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Method not allowed');
        });
    });
});
