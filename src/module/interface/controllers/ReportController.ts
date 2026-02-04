import { HttpRequest, HttpResponse, ok, created, badRequest, unauthorized, notFound, serverError } from "../http/HttpTypes";
import { SaveReportUsecase } from "../../applications/report/SaveReportUsecase";
import { ReportRepository } from "../../domain/report/repository/ReportRepository";
import { ReportMap } from "../../domain/report/mapper/ReportMap";
import { ReportPresenter } from "../presenters/ReportPresenter";

/**
 * ReportController - Handles identification report requests
 * 
 * POST /reports - Save new report
 * GET /reports - Get user's reports
 * GET /reports/:id - Get report by ID
 */
export class ReportController {
    constructor(
        private readonly saveReportUsecase: SaveReportUsecase,
        private readonly reportRepository: ReportRepository
    ) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const method = request.headers['method'] || 'POST';
        
        switch (method.toUpperCase()) {
            case 'POST':
                return this.saveReport(request);
            case 'GET':
                return request.params.id 
                    ? this.getReportById(request) 
                    : this.getUserReports(request);
            default:
                return badRequest('Method not allowed');
        }
    }

    /**
     * POST /reports - Save identification report
     */
    public async saveReport(request: HttpRequest): Promise<HttpResponse> {
        try {
            if (!request.user) {
                return unauthorized('Authentication required');
            }

            const { productId, authenticityResult, confidenceScore } = request.body;

            const result = await this.saveReportUsecase.execute({
                userId: request.user.userId,
                productId,
                authenticityResult,
                confidenceScore
            });

            return created(ReportPresenter.saveSuccess(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            
            if (message.includes('[ERROR][SAVE_REPORT]')) {
                return badRequest(message.replace('[ERROR][SAVE_REPORT]: ', ''));
            }
            
            return serverError(message);
        }
    }

    /**
     * GET /reports - Get all reports for authenticated user
     */
    public async getUserReports(request: HttpRequest): Promise<HttpResponse> {
        try {
            if (!request.user) {
                return unauthorized('Authentication required');
            }

            const reports = await this.reportRepository.fetchAll(request.user.userId);
            const reportDTOs = ReportMap.toDTOBulk(reports);

            return ok(ReportPresenter.listSuccess(reportDTOs));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * GET /reports/:id - Get report by ID
     */
    public async getReportById(request: HttpRequest): Promise<HttpResponse> {
        try {
            if (!request.user) {
                return unauthorized('Authentication required');
            }

            const { id } = request.params;
            if (!id) {
                return badRequest('Report ID is required');
            }
            const report = await this.reportRepository.findById(id);

            if (!report) {
                return notFound('Report not found');
            }

            // Check ownership or admin
            if (report.userId !== request.user.userId && request.user.role !== 'ADMIN') {
                return unauthorized('Access denied');
            }

            const reportDTO = ReportMap.toDTO(report);

            return ok(ReportPresenter.detailSuccess(reportDTO));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }
}
