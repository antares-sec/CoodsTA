import { PrismaClient } from "../../../../../generated/prisma";
import { ProductMap } from "../mapper/ProductMap";
import { Product } from "../Product";

export class ProductRepository{
    constructor(private prisma: PrismaClient){}

    async fetchAll(): Promise<Product[]>{
        const raw = await this.prisma.product.findMany()
        return ProductMap.toDomainBulk(raw)
    }

    async findById(id: string): Promise<Product | null>{
        const raw = await this.prisma.product.findUnique({where: {id: id}})
        return raw ? ProductMap.toDomain(raw): null
    }

    async save(product: Product): Promise<void>{
        const createData = ProductMap.toPersistence(product)
        const updateData = ProductMap.toUpdatePersistence(product)
        await this.prisma.product.upsert({
            where: { id: product.id},
            create: createData,
            update: updateData
        })
    }

    async deleteProduct(id: string): Promise<void>{
        const exists = await this.findById(id)
        if(!exists){
            throw new Error(`[ERROR][PRODUCT]: PRODUCT WITH ID : ${id} NOT FOUND!`)
        }
        await this.prisma.product.delete({
            where: {
                id: id
            }
        })
    }

    async count(): Promise<number> {
        return this.prisma.product.count();
    }
}