import { Entity } from "../../../shared/core/Entity";
import { Email } from "./vo/Email";
import { Password } from "./vo/Password";
import { UserRole } from "./vo/UserRole";
import { UserName } from "./vo/UserName";

interface UserProps {
    email: Email;
    name: UserName;
    password: Password;
    role: UserRole;
    created_at: Date;
    update_at: Date;
}

interface UserCreateProps {
    email: string;
    name: string;
    password: string;
    role: string;
    created_at: Date;
    update_at: Date;
    isHashed?: boolean;
}

export class User extends Entity<UserProps> {
    private constructor(id: string, props: UserProps) {
        super(id, props);
    }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this.props.email.value;
    }

    get emailVO(): Email {
        return this.props.email;
    }

    get name(): string {
        return this.props.name.value;
    }

    get nameVO(): UserName {
        return this.props.name;
    }

    get password(): string {
        return this.props.password.value;
    }

    get passwordVO(): Password {
        return this.props.password;
    }

    get role(): string {
        return this.props.role.value;
    }

    get roleVO(): UserRole {
        return this.props.role;
    }

    get createdAt(): Date {
        return this.props.created_at;
    }

    get updatedAt(): Date {
        return this.props.update_at;
    }

    static create(id: string, props: UserCreateProps): User {
        if (!id) {
            throw new Error("[ERROR][USER]: User ID is required");
        }

        // Value Objects handle their own validation
        const email = Email.create(props.email);
        const name = UserName.create(props.name);
        const password = props.isHashed 
            ? Password.createHashed(props.password)
            : Password.create(props.password);
        const role = UserRole.create(props.role);

        return new User(id, {
            email,
            name,
            password,
            role,
            created_at: props.created_at,
            update_at: props.update_at
        });
    }

    /**
     * Create User from persistence (database) - passwords are already hashed
     */
    static fromPersistence(id: string, props: UserCreateProps): User {
        return User.create(id, { ...props, isHashed: true });
    }
}