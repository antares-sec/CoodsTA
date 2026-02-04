import { ValueObject } from "../../../../shared/core/ValueObject";

interface UserNameProps {
    value: string;
}

export class UserName extends ValueObject<UserNameProps> {
    private constructor(props: UserNameProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(name: string): UserName {
        if (!name || name.trim().length === 0) {
            throw new Error('[ERROR][USERNAME]: Name is required');
        }
        if (name.trim().length < 2) {
            throw new Error('[ERROR][USERNAME]: Name must be at least 2 characters');
        }
        if (name.trim().length > 100) {
            throw new Error('[ERROR][USERNAME]: Name must not exceed 100 characters');
        }
        return new UserName({ value: name.trim() });
    }
}
