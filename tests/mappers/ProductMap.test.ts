import { ProductMap } from '../../src/module/domain/product/mapper/ProductMap';
import { Product } from '../../src/module/domain/product/Product';

describe('ProductMap', () => {
    const mockProduct = Product.fromPersistence('product-123', {
        name: 'Test Jersey',
        category: 'JERSEY',
        image_url: '/uploads/test.jpg',
        image_path: './uploads/test.jpg',
        description: 'A test jersey',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02')
    });

    const mockPrismaProduct = {
        id: 'product-123',
        name: 'Test Jersey',
        category: 'JERSEY',
        imageUrl: '/uploads/test.jpg',
        imagePath: './uploads/test.jpg',
        description: 'A test jersey',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02')
    };

    describe('toDomain', () => {
        it('should convert Prisma model to domain entity', () => {
            const product = ProductMap.toDomain(mockPrismaProduct as any);

            expect(product.id).toBe('product-123');
            expect(product.name).toBe('Test Jersey');
            expect(product.category).toBe('JERSEY');
            expect(product.imageUrl).toBe('/uploads/test.jpg');
        });

        it('should handle null name by using fallback which fails validation', () => {
            // The mapper converts null to empty string which then fails domain validation
            const prismaProduct = { ...mockPrismaProduct, name: null };

            expect(() => ProductMap.toDomain(prismaProduct as any)).toThrow('[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.');
        });

        it('should handle null imageUrl by using empty fallback', () => {
            const prismaProduct = { ...mockPrismaProduct, imageUrl: null };
            const product = ProductMap.toDomain(prismaProduct as any);

            expect(product.imageUrl).toBe('');
        });

        it('should handle null imagePath', () => {
            const prismaProduct = { ...mockPrismaProduct, imagePath: null };
            const product = ProductMap.toDomain(prismaProduct as any);

            expect(product.imagePath).toBeNull();
        });

        it('should handle null description', () => {
            const prismaProduct = { ...mockPrismaProduct, description: null };
            const product = ProductMap.toDomain(prismaProduct as any);

            expect(product.description).toBeNull();
        });
    });

    describe('toPersistence', () => {
        it('should convert domain entity to Prisma create input', () => {
            const persistence = ProductMap.toPersistence(mockProduct);

            expect(persistence.id).toBe('product-123');
            expect(persistence.name).toBe('Test Jersey');
            expect(persistence.category).toBe('JERSEY');
            expect(persistence.imageUrl).toBe('/uploads/test.jpg');
            expect(persistence.imagePath).toBe('./uploads/test.jpg');
            expect(persistence.description).toBe('A test jersey');
        });

        it('should handle null optional fields', () => {
            const product = Product.fromPersistence('product-123', {
                name: 'Test Product',
                category: 'JERSEY',
                image_url: '/uploads/test.jpg',
                image_path: null,
                description: null,
                created_at: new Date(),
                updated_at: new Date()
            });

            const persistence = ProductMap.toPersistence(product);

            expect(persistence.imagePath).toBeNull();
            expect(persistence.description).toBeNull();
        });
    });

    describe('toUpdatePersistence', () => {
        it('should convert domain entity to Prisma update input', () => {
            const updateData = ProductMap.toUpdatePersistence(mockProduct);

            expect(updateData.name).toBe('Test Jersey');
            expect(updateData.category).toBe('JERSEY');
            expect(updateData.imageUrl).toBe('/uploads/test.jpg');
            expect(updateData).not.toHaveProperty('id');
        });
    });

    describe('toDTO', () => {
        it('should convert domain entity to DTO', () => {
            const dto = ProductMap.toDTO(mockProduct);

            expect(dto.id).toBe('product-123');
            expect(dto.name).toBe('Test Jersey');
            expect(dto.category).toBe('JERSEY');
            expect(dto.imageUrl).toBe('/uploads/test.jpg');
            expect(dto.imagePath).toBe('./uploads/test.jpg');
            expect(dto.description).toBe('A test jersey');
            expect(dto.createdAt).toEqual(new Date('2024-01-01'));
            expect(dto.updatedAt).toEqual(new Date('2024-01-02'));
        });
    });

    describe('toDomainBulk', () => {
        it('should convert multiple Prisma models to domain entities', () => {
            const prismaProducts = [
                mockPrismaProduct,
                { ...mockPrismaProduct, id: 'product-456', name: 'Another Product' }
            ];

            const products = ProductMap.toDomainBulk(prismaProducts as any);

            expect(products).toHaveLength(2);
            expect(products[0].id).toBe('product-123');
            expect(products[1].id).toBe('product-456');
        });

        it('should return empty array for empty input', () => {
            const products = ProductMap.toDomainBulk([]);

            expect(products).toHaveLength(0);
        });
    });

    describe('toDTOBulk', () => {
        it('should convert multiple domain entities to DTOs', () => {
            const products = [
                mockProduct,
                Product.fromPersistence('product-456', {
                    name: 'Another Product',
                    category: 'OTHERS',
                    image_url: '/uploads/another.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                })
            ];

            const dtos = ProductMap.toDTOBulk(products);

            expect(dtos).toHaveLength(2);
            expect(dtos[0].id).toBe('product-123');
            expect(dtos[1].id).toBe('product-456');
        });

        it('should return empty array for empty input', () => {
            const dtos = ProductMap.toDTOBulk([]);

            expect(dtos).toHaveLength(0);
        });
    });
});
