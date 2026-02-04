import { ReportRepository } from "../../domain/report/repository/ReportRepository";
import { UserRepository } from "../../domain/authentication/repository/UserRepository";
import { ProductRepository } from "../../domain/product/repository/ProductRepository";
import { Report } from "../../domain/report/Report";
import { ReportMap } from "../../domain/report/mapper/ReportMap";
import { randomUUID } from "crypto";

interface SaveReportDTO {
    userId: string;
    productId: string;
    authenticityResult: 'GENUINE' | 'COUNTERFEIT';
    confidenceScore: number;
}

interface SaveReportResponse {
    success: boolean;
    message: string;
    report?: {
        id: string;
        userId: string;
        productId: string;
        authenticityResult: string;
        confidenceScore: number;
        createdAt: Date;
    };
}

/**
 * SaveReportUsecase - Application service for saving identification reports
 * 
 * Handles:
 * - Validation of user and product existence
 * - Report entity creation
 * - Persistence to database
 */
export class SaveReportUsecase {
    constructor(
        private readonly reportRepository: ReportRepository,
        private readonly userRepository: UserRepository,
        private readonly productRepository: ProductRepository
    ) {}

    async execute(dto: SaveReportDTO): Promise<SaveReportResponse> {
        // Validate input
        if (!dto.userId || dto.userId.trim().length === 0) {
            throw new Error('[ERROR][SAVE_REPORT]: User ID is required');
        }
        if (!dto.productId || dto.productId.trim().length === 0) {
            throw new Error('[ERROR][SAVE_REPORT]: Product ID is required');
        }
        if (!dto.authenticityResult) {
            throw new Error('[ERROR][SAVE_REPORT]: Authenticity result is required');
        }
        if (dto.confidenceScore === undefined || dto.confidenceScore === null) {
            throw new Error('[ERROR][SAVE_REPORT]: Confidence score is required');
        }

        // Verify user exists
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error('[ERROR][SAVE_REPORT]: User not found');
        }

        // Verify product exists
        const product = await this.productRepository.findById(dto.productId);
        if (!product) {
            throw new Error('[ERROR][SAVE_REPORT]: Product not found');
        }

        // Create report entity
        const report = Report.create(randomUUID(), {
            user_id: dto.userId,
            product_id: dto.productId,
            authenticity_result: dto.authenticityResult,
            confidence_score: dto.confidenceScore,
            created_at: new Date()
        });

        // Save report
        await this.reportRepository.save(report);

        // Return response
        const reportDTO = ReportMap.toDTO(report);

        return {
            success: true,
            message: "Report saved successfully",
            report: reportDTO
        };
    }
}
