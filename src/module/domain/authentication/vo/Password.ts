import { ValueObject } from "../../../../shared/core/ValueObject";

interface PasswordProps{
    value: string;
    isHashed: boolean;
}

export class Password extends ValueObject<PasswordProps>{
    private constructor(props: PasswordProps){
        super(props)
    }

    get value(): string{
        return this.props.value
    }

    get isHashed(): boolean{
        return this.props.isHashed
    }

    public static create(password: string): Password{
        if(!password || password.trim().length === 0){
            throw new Error('[ERROR][PASSWORD] : PASSWORD IS REQUIRED')
        }
        return new Password({ value: password, isHashed: false})
    }

    public static createHashed(hashedPassword: string): Password{
        return new Password({ value: hashedPassword, isHashed: true})
    }
}