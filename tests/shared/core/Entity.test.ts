import { Entity } from '../../../src/shared/core/Entity';

// Concrete implementation for testing
interface TestEntityProps {
    name: string;
    value: number;
}

class TestEntity extends Entity<TestEntityProps> {
    constructor(id: string, props: TestEntityProps) {
        super(id, props);
    }

    get name(): string {
        return this.props.name;
    }

    get value(): number {
        return this.props.value;
    }
}

describe('Entity', () => {
    describe('constructor', () => {
        it('should create an entity with id and props', () => {
            const entity = new TestEntity('test-id-123', { name: 'Test', value: 42 });

            expect(entity.id).toBe('test-id-123');
            expect(entity.name).toBe('Test');
            expect(entity.value).toBe(42);
        });

        it('should store the id as protected property', () => {
            const entity = new TestEntity('unique-id', { name: 'Test', value: 1 });

            expect(entity.id).toBe('unique-id');
        });
    });

    describe('equals', () => {
        it('should return true when comparing the same entity instance', () => {
            const entity = new TestEntity('id-1', { name: 'Test', value: 1 });

            expect(entity.equals(entity)).toBe(true);
        });

        it('should return true when comparing entities with the same id', () => {
            const entity1 = new TestEntity('id-1', { name: 'Test 1', value: 1 });
            const entity2 = new TestEntity('id-1', { name: 'Test 2', value: 2 });

            expect(entity1.equals(entity2)).toBe(true);
        });

        it('should return false when comparing entities with different ids', () => {
            const entity1 = new TestEntity('id-1', { name: 'Test', value: 1 });
            const entity2 = new TestEntity('id-2', { name: 'Test', value: 1 });

            expect(entity1.equals(entity2)).toBe(false);
        });

        it('should return false when comparing with null', () => {
            const entity = new TestEntity('id-1', { name: 'Test', value: 1 });

            expect(entity.equals(null as any)).toBe(false);
        });

        it('should return false when comparing with undefined', () => {
            const entity = new TestEntity('id-1', { name: 'Test', value: 1 });

            expect(entity.equals(undefined)).toBe(false);
        });
    });

    describe('id getter', () => {
        it('should return the entity id', () => {
            const entity = new TestEntity('my-unique-id', { name: 'Test', value: 1 });

            expect(entity.id).toBe('my-unique-id');
        });

        it('should return consistent id on multiple accesses', () => {
            const entity = new TestEntity('consistent-id', { name: 'Test', value: 1 });

            expect(entity.id).toBe('consistent-id');
            expect(entity.id).toBe('consistent-id');
            expect(entity.id).toBe('consistent-id');
        });
    });
});
