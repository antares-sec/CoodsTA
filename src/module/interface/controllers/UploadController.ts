import { HttpRequest, HttpResponse, ok, created, badRequest, unauthorized, serverError } from "../http/HttpTypes";
import { UploadProductUsecase } from "../../applications/product/UploadProductUsecase";
import { ProductRepository } from "../../domain/product/repository/ProductRepository";
import { ProductMap } from "../../domain/product/mapper/ProductMap";
import { ProductPresenter } from "../presenters/ProductPresenter";

/**
 * UploadController - Handles product upload and retrieval
 * 
 * POST /products - Upload new product with image
 * GET /products - Get all products
 * GET /products/:id - Get product by ID
 */
export class UploadController {
    constructor(
        private readonly uploadProductUsecase: UploadProductUsecase,
        private readonly productRepository: ProductRepository
    ) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const method = request.headers['method'] || 'POST';
        
        switch (method.toUpperCase()) {
            case 'POST':
                return this.uploadProduct(request);
            case 'GET':
                return request.params.id 
                    ? this.getProductById(request) 
                    : this.getAllProducts(request);
            default:
                return badRequest('Method not allowed');
        }
    }

    /**
     * POST /products - Upload product with image
     */
    public async uploadProduct(request: HttpRequest): Promise<HttpResponse> {
        try {
            if (!request.user) {
                return unauthorized('Authentication required');
            }

            const { name, category } = request.body;
            const file = request.file;

            if (!file) {
                return badRequest('Image file is required');
            }

            const result = await this.uploadProductUsecase.execute({
                name,
                category,
                image: {
                    buffer: file.buffer,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size
                }
            });

            return created(ProductPresenter.uploadSuccess(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            
            if (message.includes('[ERROR]')) {
                return badRequest(message.replace(/\[ERROR\]\[.*?\]: /, ''));
            }
            
            return serverError(message);
        }
    }

    /**
     * GET /products - Get all products
     */
    public async getAllProducts(request: HttpRequest): Promise<HttpResponse> {
        try {
            const products = await this.productRepository.fetchAll();
            const productDTOs = ProductMap.toDTOBulk(products);

            return ok(ProductPresenter.listSuccess(productDTOs));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * GET /products/:id - Get product by ID
     */
    public async getProductById(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params;
            if (!id) {
                return badRequest('Product ID is required');
            }
            const product = await this.productRepository.findById(id);

            if (!product) {
                return badRequest('Product not found');
            }

            const productDTO = ProductMap.toDTO(product);

            return ok(ProductPresenter.detailSuccess(productDTO));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }
}
