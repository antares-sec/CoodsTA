import { Report } from "../Report";
import { Prisma, Identifications as IdentificationsModel, Product as ProductModel, User as UserModel } from "../../../../../generated/prisma";

type IdentificationsCreateInput = Prisma.IdentificationsCreateInput;
type IdentificationsUpdateInput = Prisma.IdentificationsUpdateInput;

type IdentificationsWithRelations = IdentificationsModel & {
    product?: ProductModel | null;
    user?: UserModel | null;
};

interface ReportDTO {
    id: string;
    userId: string;
    productId: string;
    authenticityResult: string;
    confidenceScore: number;
    imagePath?: string | null | undefined;
    createdAt: Date;
    product?: {
        id: string;
        name: string;
        category: string;
        imagePath?: string | null | undefined;
    } | null | undefined;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null | undefined;
}

/**
 * ReportMapper - Mapper class for Report entity
 * 
 * Handles transformations between:
 * - Domain Entity (Report)
 * - Persistence Model (Prisma IdentificationsModel)
 * - DTO (Data Transfer Object for API responses)
 */
export class ReportMap {
    public static toDomain(raw: IdentificationsWithRelations): Report {
        return Report.fromPersistence(raw.id, {
            user_id: raw.userId,
            product_id: raw.productId,
            authenticity_result: raw.authenticityResult,
            confidence_score: raw.confidenceScore,
            created_at: raw.createdAt,
            image_path: raw.imagePath,
            product: raw.product ? {
                id: raw.product.id,
                name: raw.product.name,
                category: raw.product.category,
                imagePath: raw.product.imagePath
            } : null,
            user: raw.user ? {
                id: raw.user.id,
                name: raw.user.name ?? '',
                email: raw.user.email
            } : null
        });
    }

    public static toPersistence(report: Report): IdentificationsCreateInput {
        return {
            id: report.id,
            user: { connect: { id: report.userId } },
            product: { connect: { id: report.productId } },
            authenticityResult: report.authentictyResult as any,
            confidenceScore: report.confidenceScore,
            imagePath: report.imagePath ?? null,
            createdAt: report.createdAt
        };
    }

    public static toUpdatePersistence(report: Report): IdentificationsUpdateInput {
        return {
            authenticityResult: report.authentictyResult as any,
            confidenceScore: report.confidenceScore,
            imagePath: report.imagePath ?? null
        };
    }

    public static toDTO(report: Report): ReportDTO {
        return {
            id: report.id,
            userId: report.userId,
            productId: report.productId,
            authenticityResult: report.authenticityResult,
            confidenceScore: report.confidenceScore,
            imagePath: report.imagePath,
            createdAt: report.createdAt,
            product: report.product,
            user: report.user
        };
    }

    public static toDomainBulk(rawReports: IdentificationsWithRelations[]): Report[] {
        return rawReports.map(raw => this.toDomain(raw));
    }

    public static toDTOBulk(reports: Report[]): ReportDTO[] {
        return reports.map(report => this.toDTO(report));
    }
}
