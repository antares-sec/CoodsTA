interface ValueObjectProps {
    [key: string]: any;
}

/**
 * ValueObject base class for Domain-Driven Design
 * 
 * Value Objects are immutable and compared by their properties rather than identity.
 * They encapsulate validation logic and ensure domain invariants.
 */
export abstract class ValueObject<T extends ValueObjectProps> {
    protected readonly props: T;

    constructor(props: T) {
        this.props = Object.freeze(props);
    }

    /**
     * Compares two ValueObjects by their properties
     */
    public equals(vo?: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
}
