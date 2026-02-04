/**
 * ReportPresenter - Formats report responses to JSON
 * Uses ReportMapper.toDTO from domain for data transformation
 */

interface ReportDTO {
    id: string;
    userId: string;
    productId: string;
    authenticityResult: string;
    confidenceScore: number;
    createdAt: Date;
}

export class ReportPresenter {
    /**
     * Format save report success response
     */
    public static saveSuccess(result: {
        success: boolean;
        message: string;
        report?: ReportDTO;
    }) {
        return {
            success: result.success,
            message: result.message,
            data: result.report ? this.formatReport(result.report) : null
        };
    }

    /**
     * Format report list response
     */
    public static listSuccess(reports: ReportDTO[]) {
        const genuine = reports.filter(r => r.authenticityResult === 'GENUINE').length;
        const counterfeit = reports.filter(r => r.authenticityResult === 'COUNTERFEIT').length;

        return {
            success: true,
            message: 'Reports retrieved successfully',
            data: {
                reports: reports.map(r => this.formatReport(r)),
                total: reports.length,
                summary: {
                    genuine,
                    counterfeit
                }
            }
        };
    }

    /**
     * Format single report response
     */
    public static detailSuccess(report: ReportDTO) {
        return {
            success: true,
            message: 'Report retrieved successfully',
            data: this.formatReport(report)
        };
    }

    /**
     * Format report for JSON response
     */
    private static formatReport(report: ReportDTO) {
        return {
            id: report.id,
            userId: report.userId,
            productId: report.productId,
            authenticityResult: report.authenticityResult,
            confidenceScore: report.confidenceScore,
            isGenuine: report.authenticityResult === 'GENUINE',
            confidence: `${report.confidenceScore}%`,
            createdAt: report.createdAt instanceof Date 
                ? report.createdAt.toISOString() 
                : report.createdAt
        };
    }
}
