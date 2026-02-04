import { HttpRequest, HttpResponse, ok, created, badRequest, unauthorized, forbidden, notFound, serverError } from "../http/HttpTypes";
import { UploadModelUsecase } from "../../applications/model/UploadModelUsecase";
import { ModelRepository } from "../../domain/model/repository/ModelRepository";
import { UserRepository } from "../../domain/authentication/repository/UserRepository";
import { ProductRepository } from "../../domain/product/repository/ProductRepository";
import { ReportRepository } from "../../domain/report/repository/ReportRepository";
import { ModelMapper } from "../../domain/model/mapper/ModelMapper";
import { UserMap } from "../../domain/authentication/mapper/UserMap";
import { ProductMap } from "../../domain/product/mapper/ProductMap";
import { AdminPresenter } from "../presenters/AdminPresenter";

/**
 * AdminController - Handles admin-only requests
 * 
 * POST /admin/models - Upload ML model
 * GET /admin/models - Get all models
 * GET /admin/users - Get all users
 * GET /admin/products - Get all products
 * DELETE /admin/models/:id - Delete model
 * DELETE /admin/products/:id - Delete product
 * DELETE /admin/users/:id - Delete user
 * GET /admin/dashboard - Get dashboard stats
 * GET /admin/metrics - Get system metrics
 */
export class AdminController {
    constructor(
        private readonly uploadModelUsecase: UploadModelUsecase,
        private readonly modelRepository: ModelRepository,
        private readonly userRepository: UserRepository,
        private readonly productRepository: ProductRepository,
        private readonly reportRepository: ReportRepository
    ) {}

    async handle(request: HttpRequest): Promise<HttpResponse> {
        // Check admin authentication
        if (!request.user) {
            return unauthorized('Authentication required');
        }
        if (request.user.role !== 'ADMIN') {
            return forbidden('Admin access required');
        }

        const action = request.params.action;
        
        switch (action) {
            case 'upload-model':
                return this.uploadModel(request);
            case 'get-models':
                return this.getModels();
            case 'get-users':
                return this.getUsers();
            case 'get-products':
                return this.getProducts();
            case 'delete-model':
                return this.deleteModel(request);
            case 'delete-product':
                return this.deleteProduct(request);
            case 'delete-user':
                return this.deleteUser(request);
            case 'dashboard':
                return this.getDashboardStats();
            case 'metrics':
                return this.getSystemMetrics();
            case 'get-reports':
                return this.getReports();
            case 'delete-report':
                return this.deleteReport(request);
            default:
                return badRequest('Invalid action');
        }
    }

    /**
     * Upload new ML model
     */
    public async uploadModel(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { modelType, version, accuracy, isActive } = request.body;
            const file = request.file;

            if (!file) {
                return badRequest('Model file is required');
            }

            const result = await this.uploadModelUsecase.execute({
                modelType,
                version,
                accuracy: Number(accuracy),
                file: {
                    buffer: file.buffer,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size
                },
                isActive: isActive !== 'false'
            });

            return created(AdminPresenter.modelUploadSuccess(result));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            
            if (message.includes('[ERROR]')) {
                return badRequest(message.replace(/\[ERROR\]\[.*?\]: /, ''));
            }
            
            return serverError(message);
        }
    }

    /**
     * Get all models
     */
    public async getModels(): Promise<HttpResponse> {
        try {
            const models = await this.modelRepository.fetchAll();
            const modelDTOs = ModelMapper.toDTOBulk(models);

            return ok(AdminPresenter.modelsListSuccess(modelDTOs));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * Get all users
     */
    public async getUsers(): Promise<HttpResponse> {
        try {
            const users = await this.userRepository.fetchAll();
            const userDTOs = users.map(u => UserMap.toDTO(u));

            return ok(AdminPresenter.usersListSuccess(userDTOs));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * Get all products
     */
    public async getProducts(): Promise<HttpResponse> {
        try {
            const products = await this.productRepository.fetchAll();
            const productDTOs = ProductMap.toDTOBulk(products);

            return ok(AdminPresenter.productsListSuccess(productDTOs));
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * Delete model
     */
    public async deleteModel(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params;
            if (!id) {
                return badRequest('Model ID is required');
            }
            await this.modelRepository.delete(id);

            return ok({ success: true, message: 'Model deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('NOT FOUND')) {
                return notFound('Model not found');
            }
            return serverError(message);
        }
    }

    /**
     * Delete product
     */
    public async deleteProduct(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params;
            if (!id) {
                return badRequest('Product ID is required');
            }
            await this.productRepository.deleteProduct(id);

            return ok({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('NOT FOUND')) {
                return notFound('Product not found');
            }
            return serverError(message);
        }
    }

    /**
     * Delete user
     */
    public async deleteUser(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params;
            if (!id) {
                return badRequest('User ID is required');
            }
            await this.userRepository.deleteById(id);

            return ok({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('NOT FOUND')) {
                return notFound('User not found');
            }
            return serverError(message);
        }
    }

    /**
     * Get all reports
     */
    public async getReports(): Promise<HttpResponse> {
        try {
            const reports = await this.reportRepository.fetchAll();
            const reportDTOs = reports.map(r => ({
                id: r.id,
                productId: r.productId,
                userId: r.userId,
                authenticityResult: r.authenticityResult,
                confidenceScore: r.confidenceScore,
                imagePath: r.imagePath,
                createdAt: r.createdAt,
                product: r.product,
                user: r.user
            }));

            return ok({ success: true, reports: reportDTOs });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * Delete report
     */
    public async deleteReport(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params;
            if (!id) {
                return badRequest('Report ID is required');
            }
            await this.reportRepository.deleteReport(id);

            return ok({ success: true, message: 'Report deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (message.includes('NOT FOUND')) {
                return notFound('Report not found');
            }
            return serverError(message);
        }
    }

    /**
     * Get dashboard stats
     */
    public async getDashboardStats(): Promise<HttpResponse> {
        try {
            const [totalUsers, totalProducts, totalScans, genuineCount, counterfeitCount] = await Promise.all([
                this.userRepository.count(),
                this.productRepository.count(),
                this.reportRepository.count(),
                this.reportRepository.countByResult('GENUINE'),
                this.reportRepository.countByResult('COUNTERFEIT')
            ]);

            const models = await this.modelRepository.fetchAll();
            const activeModels = models.filter(m => m.isActive === 'ACTIVE').length;

            const recentScans = await this.reportRepository.getRecentScans(10);
            const recentScansDTO = recentScans.map(r => ({
                id: r.id,
                productId: r.productId,
                userId: r.userId,
                authenticityResult: r.authenticityResult,
                confidenceScore: r.confidenceScore,
                imagePath: r.imagePath,
                createdAt: r.createdAt,
                product: r.product,
                user: r.user
            }));

            // Generate mock weekly data (in production, this would come from analytics)
            const weeklyData = this.generateWeeklyData();

            return ok({
                success: true,
                data: {
                    totalUsers,
                    totalProducts,
                    totalScans,
                    activeModels,
                    genuineCount,
                    counterfeitCount,
                    weeklyData,
                    recentScans: recentScansDTO
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    /**
     * Get system metrics
     */
    public async getSystemMetrics(): Promise<HttpResponse> {
        try {
            const models = await this.modelRepository.fetchAll();
            const activeModels = models.filter(m => m.isActive === 'ACTIVE');

            // Generate mock metrics (in production, this would come from monitoring system)
            const cpu = Math.floor(Math.random() * 40) + 20;
            const memory = Math.floor(Math.random() * 30) + 40;
            const gpu = Math.floor(Math.random() * 50) + 30;
            const avgLatency = Math.floor(Math.random() * 80) + 50;

            const hourlyData = this.generateHourlyData();
            const modelPerformance = activeModels.map(m => ({
                name: `${m.modelType} v${m.version}`,
                requests: Math.floor(Math.random() * 5000) + 1000,
                avgTime: Math.floor(Math.random() * 100) + 50,
                successRate: (Math.random() * 5 + 95).toFixed(1)
            }));

            // Return empty errors array for healthy system
            const recentErrors: { id: string; type: string; message: string; count: number; time: string }[] = [];

            return ok({
                success: true,
                data: {
                    cpu,
                    memory,
                    gpu,
                    avgLatency,
                    hourlyData,
                    modelPerformance,
                    recentErrors
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return serverError(message);
        }
    }

    private generateWeeklyData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(name => ({
            name,
            scans: Math.floor(Math.random() * 100) + 20,
            genuine: Math.floor(Math.random() * 60) + 20,
            counterfeit: Math.floor(Math.random() * 30) + 5
        }));
    }

    private generateHourlyData() {
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push({
                name: `${i.toString().padStart(2, '0')}:00`,
                requests: Math.floor(Math.random() * 200) + 50,
                latency: Math.floor(Math.random() * 80) + 40
            });
        }
        return data;
    }
}
