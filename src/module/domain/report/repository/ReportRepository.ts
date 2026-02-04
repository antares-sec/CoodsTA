import { PrismaClient, IdentificationResult } from "../../../../../generated/prisma";
import { ReportMap } from "../mapper/ReportMap";
import { Report } from "../Report";

export class ReportRepository{
    constructor(private prisma: PrismaClient){}

    async fetchAll(userId?: string): Promise<Report[]>{
        const raw = await this.prisma.identifications.findMany({
            ...(userId && { where: { userId: userId } }),
            include: {
                product: true,
                user: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return ReportMap.toDomainBulk(raw)
    }

    async findById(id: string): Promise<Report | null>{
        const raw = await this.prisma.identifications.findUnique({
            where: {id: id},
            include: {
                product: true,
                user: true
            }
        })
        return raw ? ReportMap.toDomain(raw): null
    }

    async save(report: Report): Promise<void>{
        const createData = ReportMap.toPersistence(report)
        const updateData = ReportMap.toUpdatePersistence(report)
        await this.prisma.identifications.upsert({
            where: { id: report.id },
            create: createData,
            update: updateData
        })
    }

    async deleteReport(id: string): Promise<void>{
        const exists = await this.findById(id)
        if(!exists){
            throw new Error(`[ERROR][REPORT]: REPORT WITH ID : ${id} NOT FOUND!`)
        }

        await this.prisma.identifications.delete({
            where: {
                id: id
            }
        })
    }

    async count(): Promise<number> {
        return this.prisma.identifications.count();
    }

    async countByResult(result: IdentificationResult): Promise<number> {
        return this.prisma.identifications.count({
            where: { authenticityResult: result }
        });
    }

    async getRecentScans(limit: number = 10): Promise<Report[]> {
        const raw = await this.prisma.identifications.findMany({
            include: {
                product: true,
                user: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return ReportMap.toDomainBulk(raw);
    }
}