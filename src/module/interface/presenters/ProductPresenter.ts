/**
 * ProductPresenter - Formats product responses to JSON
 * Uses ProductMap.toDTO from domain for data transformation
 */

interface ProductDTO {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ProductPresenter {
    /**
     * Format upload success response
     */
    public static uploadSuccess(result: {
        success: boolean;
        message: string;
        product?: ProductDTO;
    }) {
        return {
            success: result.success,
            message: result.message,
            data: result.product ? this.formatProduct(result.product) : null
        };
    }

    /**
     * Format product list response
     */
    public static listSuccess(products: ProductDTO[]) {
        return {
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products: products.map(p => this.formatProduct(p)),
                total: products.length
            }
        };
    }

    /**
     * Format single product response
     */
    public static detailSuccess(product: ProductDTO) {
        return {
            success: true,
            message: 'Product retrieved successfully',
            data: this.formatProduct(product)
        };
    }

    /**
     * Format product for JSON response
     */
    private static formatProduct(product: ProductDTO) {
        return {
            id: product.id,
            name: product.name,
            category: product.category,
            imageUrl: product.imageUrl,
            createdAt: product.createdAt instanceof Date 
                ? product.createdAt.toISOString() 
                : product.createdAt,
            updatedAt: product.updatedAt instanceof Date 
                ? product.updatedAt.toISOString() 
                : product.updatedAt
        };
    }
}
