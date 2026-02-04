import { Report } from "../Report";
import type { Identifications, Prisma } from "../../../../../generated/prisma";

type IdentificationsModel = Identifications;
type IdentificationsCreateInput = Prisma.IdentificationsCreateInput;
type IdentificationsUpdateInput = Prisma.IdentificationsUpdateInput;

interface ReportDTO {
    id: string;
    userId: string;
    productId: string;
    authenticityResult: string;
    confidenceScore: number;
    createdAt: Date;
}

/**
 * ReportMapper - Mapper class for Report entity
 * 
 * Handles transformations between:
 * - Domain Entity (Report)
 * - Persistence Model (Prisma IdentificationsModel)
 * - DTO (Data Transfer Object for API responses)
 */
export class ReportMapper {
    public static toDomain(raw: IdentificationsModel): Report {
        return Report.fromPersistence(raw.id, {
            user_id: raw.userId,
            product_id: raw.productId,
            authenticity_result: raw.authenticityResult,
            confidence_score: raw.confidenceScore,
            created_at: raw.createdAt
        });
    }

    public static toPersistence(report: Report): IdentificationsCreateInput {
        return {
            id: report.id,
            user: { connect: { id: report.userId } },
            product: { connect: { id: report.productId } },
            authenticityResult: report.authentictyResult as any,
            confidenceScore: report.confidenceScore,
            createdAt: report.createdAt
        };
    }

    public static toUpdatePersistence(report: Report): IdentificationsUpdateInput {
        return {
            authenticityResult: report.authentictyResult as any,
            confidenceScore: report.confidenceScore
        };
    }

    public static toDTO(report: Report): ReportDTO {
        return {
            id: report.id,
            userId: report.userId,
            productId: report.productId,
            authenticityResult: report.authentictyResult,
            confidenceScore: report.confidenceScore,
            createdAt: report.createdAt
        };
    }

    public static toDomainBulk(rawReports: IdentificationsModel[]): Report[] {
        return rawReports.map(raw => this.toDomain(raw));
    }

    public static toDTOBulk(reports: Report[]): ReportDTO[] {
        return reports.map(report => this.toDTO(report));
    }
}
