import { ValueObject } from "../../../../shared/core/ValueObject";

type RoleType = 'ADMIN' | 'USER'

interface RoleProps{
    value: RoleType
}

export class UserRole extends ValueObject<RoleProps>{
    private constructor(props: RoleProps){
        super(props)
    }

    get value(): RoleType{
        return this.props.value
    }

    public isAdmin(): boolean {
        return this.props.value === 'ADMIN';
    }

    public isUser(): boolean {
        return this.props.value === 'USER';
    }

    public static create(role: string): UserRole{
        const validRoles: RoleType[] = ['ADMIN', 'USER']
        const upperRole = role.toUpperCase() as RoleType;

        if(!validRoles.includes(upperRole)){
            throw new Error(`[ERROR][ROLE]: INVALID ROLE. MUST BE ONE OF: ${validRoles}`)
        }
        return new UserRole({
            value: upperRole
        })
    }

    public static user(): UserRole {
        return new UserRole({ value: 'USER' });
    }

    public static admin(): UserRole {
        return new UserRole({ value: 'ADMIN' });
    }
}