import { Category } from '../../../../src/module/domain/product/vo/Category';

describe('Category ValueObject', () => {
    describe('create', () => {
        it('should create JERSEY category', () => {
            const category = Category.create('JERSEY');

            expect(category.value).toBe('JERSEY');
        });

        it('should create OTHERS category', () => {
            const category = Category.create('OTHERS');

            expect(category.value).toBe('OTHERS');
        });

        it('should handle lowercase input for JERSEY', () => {
            const category = Category.create('jersey');

            expect(category.value).toBe('JERSEY');
        });

        it('should handle lowercase input for OTHERS', () => {
            const category = Category.create('others');

            expect(category.value).toBe('OTHERS');
        });

        it('should handle mixed case input', () => {
            const category = Category.create('JeRsEy');

            expect(category.value).toBe('JERSEY');
        });

        it('should throw error for invalid category', () => {
            expect(() => Category.create('SHOES')).toThrow('[ERROR][CATEGORY]: INVALID CATEGORY TYPE.');
        });

        it('should throw error for empty category', () => {
            expect(() => Category.create('')).toThrow();
        });

        it('should throw error for random string', () => {
            expect(() => Category.create('electronics')).toThrow('[ERROR][CATEGORY]: INVALID CATEGORY TYPE.');
        });
    });

    describe('static factory methods', () => {
        describe('jersey', () => {
            it('should create JERSEY category', () => {
                const category = Category.jersey();

                expect(category.value).toBe('JERSEY');
            });

            it('should return isJersey true', () => {
                const category = Category.jersey();

                expect(category.isJersey()).toBe(true);
                expect(category.isOthers()).toBe(false);
            });
        });

        describe('others', () => {
            it('should create OTHERS category', () => {
                const category = Category.others();

                expect(category.value).toBe('OTHERS');
            });

            it('should return isOthers true', () => {
                const category = Category.others();

                expect(category.isOthers()).toBe(true);
                expect(category.isJersey()).toBe(false);
            });
        });
    });

    describe('isJersey', () => {
        it('should return true for JERSEY category', () => {
            const category = Category.create('JERSEY');

            expect(category.isJersey()).toBe(true);
        });

        it('should return false for OTHERS category', () => {
            const category = Category.create('OTHERS');

            expect(category.isJersey()).toBe(false);
        });
    });

    describe('isOthers', () => {
        it('should return true for OTHERS category', () => {
            const category = Category.create('OTHERS');

            expect(category.isOthers()).toBe(true);
        });

        it('should return false for JERSEY category', () => {
            const category = Category.create('JERSEY');

            expect(category.isOthers()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for categories with same value', () => {
            const category1 = Category.create('JERSEY');
            const category2 = Category.create('JERSEY');

            expect(category1.equals(category2)).toBe(true);
        });

        it('should return true for categories created with different cases', () => {
            const category1 = Category.create('jersey');
            const category2 = Category.create('JERSEY');

            expect(category1.equals(category2)).toBe(true);
        });

        it('should return false for different categories', () => {
            const category1 = Category.create('JERSEY');
            const category2 = Category.create('OTHERS');

            expect(category1.equals(category2)).toBe(false);
        });

        it('should return true for factory created categories with same type', () => {
            const category1 = Category.jersey();
            const category2 = Category.jersey();

            expect(category1.equals(category2)).toBe(true);
        });

        it('should return true for factory and create with same type', () => {
            const category1 = Category.others();
            const category2 = Category.create('OTHERS');

            expect(category1.equals(category2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the category value', () => {
            const category = Category.create('JERSEY');
            expect(category.value).toBe('JERSEY');
        });
    });
});
