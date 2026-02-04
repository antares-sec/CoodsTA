import { ValueObject } from "../../../../shared/core/ValueObject";

interface EmailProps{
    value: string
}

export class Email extends ValueObject<EmailProps>{
    private constructor(props: EmailProps){
        super(props)
    }

    get value(): string{
        return this.props.value
    }

    private static isValidEmail(email: string): boolean{
        // CHECK THE FORMAT OF EMAIL
        // SHOULD HAVE "@"
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email)
    }

    public static create(email: string): Email{
        // VALIDATE IF LENGTH NOT 0
        if(!email || email.trim().length === 0){
            throw new Error('[ERROR][EMAIL]: Email is required')
        }
        // CHECK IF FORMAT IS CORRECT
        if(!this.isValidEmail(email)){
            throw new Error('[ERROR][EMAIL]: Invalid email format')
        }

        return new Email({ value : email.toLowerCase().trim() })
    }

}