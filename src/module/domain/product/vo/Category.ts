import { ValueObject } from "../../../../shared/core/ValueObject";

type ProductCategoryType = 'JERSEY' | 'OTHERS'

interface ProductProps{
    value: ProductCategoryType
}

export class Category extends ValueObject<ProductProps>{
    private constructor(props: ProductProps){
        super(props)
    }

    get value(): ProductCategoryType{
        return this.props.value
    }

    public isJersey(): boolean{
        return this.props.value === 'JERSEY'
    }

    public isOthers(): boolean{
        return this.props.value === 'OTHERS'
    }

    public static create(category: string): Category{
        const validCategory: ProductCategoryType[] = ['JERSEY', 'OTHERS']
        const upperCategory = category.toUpperCase() as ProductCategoryType

        if(!validCategory.includes(upperCategory)){
            throw new Error(`[ERROR][CATEGORY]: INVALID CATEGORY TYPE.`)
        }
        return new Category({
            value: upperCategory
        })
    }

    public static jersey(): Category{
        return new Category({ value: 'JERSEY'})
    }

    public static others(): Category{
        return new Category({ value: 'OTHERS'})
    }
}