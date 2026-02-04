import { ValueObject } from "../../../../shared/core/ValueObject";

type AuthenticityResultType = "GENUINE" | "COUNTERFEIT"

interface AuthenticityProps{
    value: AuthenticityResultType
}

export class Authenticity extends ValueObject<AuthenticityProps>{
    private constructor(props: AuthenticityProps){
        super(props)
    }

    get value(): AuthenticityResultType{
        return this.props.value
    }

    public isGenuine(): boolean{
        return this.props.value === 'GENUINE'
    }

    public isCounterfeit(): boolean{
        return this.props.value === 'COUNTERFEIT'
    }

    public static create(authenticity: string): Authenticity{
        const validAuthenticity: AuthenticityResultType[] = ['GENUINE', 'COUNTERFEIT']
        const upperAuthenticity = authenticity.toUpperCase() as AuthenticityResultType

        if(!validAuthenticity.includes(upperAuthenticity)){
            throw new Error(`[ERROR][AUTHENTICITY]: INVALID AUTHENTICITY TYPE`)
        }
        return new Authenticity({
            value: upperAuthenticity
        })
    }

    public static genuine(): Authenticity{
        return new Authenticity({
            value: 'GENUINE'
        })
    }

    public static counterfeit(): Authenticity{
        return new Authenticity({
            value: 'COUNTERFEIT'
        })
    }
}