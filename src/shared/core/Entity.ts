/**
 * THIS FILE IS A BASE CLASS FOR EACH ENTITIES DEFINED INSIDE OF OUR APPLICATIONS.
 * IT WILL BE OUR DOMAIN CONFIGURATION BASE TO HANDLES EVERY DATA OR SHOULD WE SAY "PROPS"
 * OR PROPERTY DEFINED IN DOMAIN.
 */

export abstract class Entity<TProps> {
    // Only can be read and changes from base class ("extended" to other classes)
    protected readonly _id: string;
    protected props: TProps;
    
    constructor(id: string, props: TProps) {
        this._id = id;
        this.props = props;
    }
    
    // GET ID FROM EACH ENTITY
    get id(): string {
        return this._id;
    }

    public equals(entity?: Entity<TProps>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }

        if (this === entity) {
            return true;
        }

        return this._id === entity._id;
    }
}