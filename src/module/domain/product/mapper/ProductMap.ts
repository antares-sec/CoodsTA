import { Product } from "../Product";
import { Prisma, Product as ProductModel } from "../../../../../generated/prisma";

type ProductCreateInput = Prisma.ProductCreateInput;
type ProductUpdateInput = Prisma.ProductUpdateInput;


interface ProductDTO{
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    imagePath?: string | null | undefined;
    description?: string | null | undefined;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ProductMap - Mapper class for Product entity
 * 
 * Handles transformations between:
 * - Domain Entity (Product)
 * - Persistence Model (Prisma ProductModel)
 * - DTO (Data Transfer Object for API responses)
 */
export class ProductMap{
    public static toDomain(raw: ProductModel): Product{
        return Product.fromPersistence(raw.id, {
            name: raw.name ?? '',
            category: raw.category,
            image_url: raw.imageUrl ?? '',
            image_path: raw.imagePath,
            description: raw.description,
            created_at: raw.createdAt,
            updated_at: raw.updatedAt
        })
    }

    public static toPersistence(product: Product): ProductCreateInput{
        return {
            id: product.id,
            name: product.name,
            category: product.category as any,
            imageUrl: product.imageUrl,
            imagePath: product.imagePath ?? null,
            description: product.description ?? null,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        }
    }

    public static toUpdatePersistence(product: Product): ProductUpdateInput {
        return {
            name: product.name,
            category: product.category as any,
            imageUrl: product.imageUrl,
            imagePath: product.imagePath ?? null,
            description: product.description ?? null,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
            
        };
    }

    public static toDTO(product: Product): ProductDTO {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            imageUrl: product.imageUrl,
            imagePath: product.imagePath,
            description: product.description,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    }

    public static toDomainBulk(rawProduct: ProductModel[]): Product[] {
        return rawProduct.map(raw => this.toDomain(raw));
    }

    /**
     * Convert multiple Domain entities to DTOs
     */
    public static toDTOBulk(product: Product[]): ProductDTO[] {
        return product.map(product => this.toDTO(product));
    }
}