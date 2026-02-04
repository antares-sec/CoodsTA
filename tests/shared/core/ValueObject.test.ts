import { ValueObject } from '../../../src/shared/core/ValueObject';

// Concrete implementation for testing
interface TestValueObjectProps {
    value: string;
    count: number;
}

class TestValueObject extends ValueObject<TestValueObjectProps> {
    constructor(props: TestValueObjectProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    get count(): number {
        return this.props.count;
    }
}

describe('ValueObject', () => {
    describe('constructor', () => {
        it('should create a value object with frozen props', () => {
            const vo = new TestValueObject({ value: 'test', count: 5 });

            expect(vo.value).toBe('test');
            expect(vo.count).toBe(5);
        });

        it('should freeze the props object', () => {
            const vo = new TestValueObject({ value: 'test', count: 5 });

            // Attempting to modify should fail silently or throw in strict mode
            expect(() => {
                (vo as any).props.value = 'modified';
            }).toThrow();
        });
    });

    describe('equals', () => {
        it('should return true for value objects with the same props', () => {
            const vo1 = new TestValueObject({ value: 'test', count: 5 });
            const vo2 = new TestValueObject({ value: 'test', count: 5 });

            expect(vo1.equals(vo2)).toBe(true);
        });

        it('should return false for value objects with different props', () => {
            const vo1 = new TestValueObject({ value: 'test', count: 5 });
            const vo2 = new TestValueObject({ value: 'different', count: 5 });

            expect(vo1.equals(vo2)).toBe(false);
        });

        it('should return false for value objects with different counts', () => {
            const vo1 = new TestValueObject({ value: 'test', count: 5 });
            const vo2 = new TestValueObject({ value: 'test', count: 10 });

            expect(vo1.equals(vo2)).toBe(false);
        });

        it('should return false when comparing with null', () => {
            const vo = new TestValueObject({ value: 'test', count: 5 });

            expect(vo.equals(null as any)).toBe(false);
        });

        it('should return false when comparing with undefined', () => {
            const vo = new TestValueObject({ value: 'test', count: 5 });

            expect(vo.equals(undefined)).toBe(false);
        });

        it('should return false when comparing with object without props', () => {
            const vo = new TestValueObject({ value: 'test', count: 5 });
            const invalidVo = { props: undefined } as any;

            expect(vo.equals(invalidVo)).toBe(false);
        });

        it('should handle complex nested objects correctly', () => {
            interface ComplexProps {
                nested: { a: number; b: string };
            }

            class ComplexVO extends ValueObject<ComplexProps> {
                constructor(props: ComplexProps) {
                    super(props);
                }
            }

            const vo1 = new ComplexVO({ nested: { a: 1, b: 'test' } });
            const vo2 = new ComplexVO({ nested: { a: 1, b: 'test' } });
            const vo3 = new ComplexVO({ nested: { a: 2, b: 'test' } });

            expect(vo1.equals(vo2)).toBe(true);
            expect(vo1.equals(vo3)).toBe(false);
        });
    });
});
