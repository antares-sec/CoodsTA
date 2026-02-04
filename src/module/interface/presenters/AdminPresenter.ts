/**
 * AdminPresenter - Formats admin responses to JSON
 * Uses domain Mappers (ModelMapper, UserMap, ProductMap) for data transformation
 */

interface ModelDTO {
    id: string;
    modelType: string;
    version: string;
    filePath: string;
    accuracy: number;
    deploymentDate: Date;
    createdAt: Date;
    isActive: string;
}

interface UserDTO {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ProductDTO {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export class AdminPresenter {
    /**
     * Format model upload success response
     */
    public static modelUploadSuccess(result: {
        success: boolean;
        message: string;
        model?: ModelDTO;
    }) {
        return {
            success: result.success,
            message: result.message,
            data: result.model ? this.formatModel(result.model) : null
        };
    }

    /**
     * Format models list response
     */
    public static modelsListSuccess(models: ModelDTO[]) {
        const active = models.filter(m => m.isActive === 'ACTIVE').length;

        return {
            success: true,
            message: 'Models retrieved successfully',
            data: {
                models: models.map(m => this.formatModel(m)),
                total: models.length,
                summary: {
                    active,
                    deactivated: models.length - active,
                    detectors: models.filter(m => m.modelType === 'DETECTOR').length,
                    classificators: models.filter(m => m.modelType === 'CLASSIFICATOR').length
                }
            }
        };
    }

    /**
     * Format users list response
     */
    public static usersListSuccess(users: UserDTO[]) {
        return {
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users: users.map(u => this.formatUser(u)),
                total: users.length,
                summary: {
                    admins: users.filter(u => u.role === 'ADMIN').length,
                    users: users.filter(u => u.role === 'USER').length
                }
            }
        };
    }

    /**
     * Format products list response
     */
    public static productsListSuccess(products: ProductDTO[]) {
        return {
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products: products.map(p => this.formatProduct(p)),
                total: products.length,
                summary: {
                    jerseys: products.filter(p => p.category === 'JERSEY').length,
                    others: products.filter(p => p.category === 'OTHERS').length
                }
            }
        };
    }

    /**
     * Format model for JSON response
     */
    private static formatModel(model: ModelDTO) {
        return {
            id: model.id,
            modelType: model.modelType,
            version: model.version,
            filePath: model.filePath,
            accuracy: model.accuracy,
            accuracyFormatted: `${model.accuracy}%`,
            deploymentDate: model.deploymentDate instanceof Date 
                ? model.deploymentDate.toISOString() 
                : model.deploymentDate,
            createdAt: model.createdAt instanceof Date 
                ? model.createdAt.toISOString() 
                : model.createdAt,
            isActive: model.isActive === 'ACTIVE'
        };
    }

    /**
     * Format user for JSON response
     */
    private static formatUser(user: UserDTO) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt instanceof Date 
                ? user.createdAt.toISOString() 
                : user.createdAt,
            updatedAt: user.updatedAt instanceof Date 
                ? user.updatedAt.toISOString() 
                : user.updatedAt
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
