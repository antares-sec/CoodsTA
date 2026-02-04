import { Product } from '../../../src/module/domain/product/Product';

describe('Product Entity', () => {
    const validProductProps = {
        name: 'Test Jersey',
        category: 'JERSEY',
        image_url: '/uploads/test-image.jpg',
        image_path: './uploads/test-image.jpg',
        description: 'A test jersey product',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02')
    };

    describe('create', () => {
        it('should create a valid product', () => {
            const product = Product.create('product-123', validProductProps);

            expect(product.id).toBe('product-123');
            expect(product.name).toBe('Test Jersey');
            expect(product.category).toBe('JERSEY');
            expect(product.imageUrl).toBe('/uploads/test-image.jpg');
        });

        it('should throw error when id is empty', () => {
            expect(() => Product.create('', validProductProps)).toThrow('[ERROR][PRODUCT]: ID NOT FOUND');
        });

        it('should throw error when id is null', () => {
            expect(() => Product.create(null as any, validProductProps)).toThrow('[ERROR][PRODUCT]: ID NOT FOUND');
        });

        it('should throw error when id is undefined', () => {
            expect(() => Product.create(undefined as any, validProductProps)).toThrow('[ERROR][PRODUCT]: ID NOT FOUND');
        });

        it('should throw error when name is empty', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                name: ''
            })).toThrow('[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.');
        });

        it('should throw error when name is null', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                name: null as any
            })).toThrow('[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.');
        });

        it('should throw error when name is undefined', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                name: undefined as any
            })).toThrow('[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.');
        });

        it('should throw error when name is whitespace only', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                name: '   '
            })).toThrow('[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.');
        });

        it('should throw error when category is null', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                category: null as any
            })).toThrow('[ERROR][PRODUCT]: CATEGORY IS REQUIRED');
        });

        it('should throw error when category is undefined', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                category: undefined as any
            })).toThrow('[ERROR][PRODUCT]: CATEGORY IS REQUIRED');
        });

        it('should throw error for invalid category', () => {
            expect(() => Product.create('product-123', {
                ...validProductProps,
                category: 'INVALID'
            })).toThrow('[ERROR][CATEGORY]: INVALID CATEGORY TYPE.');
        });

        it('should create product with OTHERS category', () => {
            const product = Product.create('product-123', {
                ...validProductProps,
                category: 'OTHERS'
            });

            expect(product.category).toBe('OTHERS');
        });

        it('should handle optional description as null', () => {
            const product = Product.create('product-123', {
                ...validProductProps,
                description: null
            });

            expect(product.description).toBeNull();
        });

        it('should handle optional image_path as null', () => {
            const product = Product.create('product-123', {
                ...validProductProps,
                image_path: null
            });

            expect(product.imagePath).toBeNull();
        });

        it('should handle optional fields as undefined', () => {
            const product = Product.create('product-123', {
                name: 'Test Product',
                category: 'JERSEY',
                image_url: '/uploads/test.jpg',
                created_at: new Date(),
                updated_at: new Date()
            });

            expect(product.description).toBeUndefined();
            expect(product.imagePath).toBeUndefined();
        });
    });

    describe('fromPersistence', () => {
        it('should create product from persistence', () => {
            const product = Product.fromPersistence('product-123', validProductProps);

            expect(product.id).toBe('product-123');
            expect(product.name).toBe('Test Jersey');
            expect(product.category).toBe('JERSEY');
        });
    });

    describe('getters', () => {
        let product: Product;

        beforeEach(() => {
            product = Product.create('product-123', validProductProps);
        });

        it('should return id', () => {
            expect(product.id).toBe('product-123');
        });

        it('should return name', () => {
            expect(product.name).toBe('Test Jersey');
        });

        it('should return category', () => {
            expect(product.category).toBe('JERSEY');
        });

        it('should return categoryVO', () => {
            expect(product.categoryVO.value).toBe('JERSEY');
            expect(product.categoryVO.isJersey()).toBe(true);
        });

        it('should return imageUrl', () => {
            expect(product.imageUrl).toBe('/uploads/test-image.jpg');
        });

        it('should return imagePath', () => {
            expect(product.imagePath).toBe('./uploads/test-image.jpg');
        });

        it('should return description', () => {
            expect(product.description).toBe('A test jersey product');
        });

        it('should return createdAt', () => {
            expect(product.createdAt).toEqual(new Date('2024-01-01'));
        });

        it('should return updatedAt', () => {
            expect(product.updatedAt).toEqual(new Date('2024-01-02'));
        });
    });

    describe('equals', () => {
        it('should return true for products with same id', () => {
            const product1 = Product.create('product-123', validProductProps);
            const product2 = Product.create('product-123', { ...validProductProps, name: 'Different Name' });

            expect(product1.equals(product2)).toBe(true);
        });

        it('should return false for products with different ids', () => {
            const product1 = Product.create('product-123', validProductProps);
            const product2 = Product.create('product-456', validProductProps);

            expect(product1.equals(product2)).toBe(false);
        });
    });
});
