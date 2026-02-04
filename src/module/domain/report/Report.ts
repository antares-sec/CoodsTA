import { Entity } from "../../../shared/core/Entity";
import { Authenticity } from "./vo/AuthenticityResult";
import { ConfidenceScore } from "./vo/ConfidenceScore";

interface ProductData {
    id: string;
    name: string;
    category: string;
    imagePath?: string | null;
}

interface UserData {
    id: string;
    name: string;
    email: string;
}

interface ReportInterface{
    user_id: string
    product_id: string
    authenticity_result: Authenticity
    confidence_score: ConfidenceScore
    created_at: Date
    image_path?: string | null | undefined
    product?: ProductData | null | undefined
    user?: UserData | null | undefined
}

interface ReportCreateProps{
    user_id: string,
    product_id: string,
    authenticity_result: string
    confidence_score: number
    created_at: Date
    image_path?: string | null
    product?: ProductData | null
    user?: UserData | null
}

export class Report extends Entity<ReportInterface>{
    constructor(id: string, props: ReportInterface){
        super(id, props)
    }

    get id(): string{
        return this._id
    }

    get userId(): string{
        return this.props.user_id
    }

    get productId(): string{
        return this.props.product_id
    }

    get authenticityResult(): string{
        return this.props.authenticity_result.value
    }

    get authentictyResult(): string{
        return this.props.authenticity_result.value
    }

    get authentictyResultVO(): Authenticity{
        return this.props.authenticity_result
    }

    get confidenceScore(): number{
        return this.props.confidence_score.value
    } 

    get confidenceScoreVO(): ConfidenceScore{
        return this.props.confidence_score
    }

    get createdAt(): Date{
        return this.props.created_at
    }

    get imagePath(): string | null | undefined {
        return this.props.image_path
    }

    get product(): ProductData | null | undefined {
        return this.props.product
    }

    get user(): UserData | null | undefined {
        return this.props.user
    }

    static create(id: string, props: ReportCreateProps): Report{
        if(!id){
            throw new Error(`[ERROR][REPORT]: ID NOT FOUND`)
        }

        const authenticityResult = Authenticity.create(props.authenticity_result)
        const confidenceScore = ConfidenceScore.create(props.confidence_score)

        return new Report(id, {
            user_id: props.user_id,
            product_id: props.product_id,
            authenticity_result: authenticityResult,
            confidence_score: confidenceScore,
            created_at: props.created_at,
            image_path: props.image_path,
            product: props.product,
            user: props.user
        })
    }

    static fromPersistence(id: string, props: ReportCreateProps): Report{
        return Report.create(id, {...props})
    }
}