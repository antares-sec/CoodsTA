import { Entity } from "../../../shared/core/Entity";
import { Category } from "./vo/Category";

interface ProductInterface{
    name: string;
    category: Category;
    image_url: string;
    image_path?: string | null | undefined;
    description?: string | null | undefined;
    created_at: Date;
    updated_at: Date
}

interface ProductCreateProps{
    name: string;
    category: string;    
    image_url: string;
    image_path?: string | null;
    description?: string | null;
    created_at: Date;
    updated_at: Date;
}

export class Product extends Entity<ProductInterface>{
    constructor(id: string, props: ProductInterface){
        super(id, props)
    }

    get id(): string{
        return this._id
    }

    get name(): string{
        return this.props.name
    }

    get category(): string{
        return this.props.category.value
    }
    
    get categoryVO(): Category{
        return this.props.category
    }

    get createdAt(): Date{
        return this.props.created_at
    }

    get imageUrl(): string{
        return this.props.image_url
    }

    get imagePath(): string | null | undefined {
        return this.props.image_path
    }

    get description(): string | null | undefined {
        return this.props.description
    }

    get updatedAt(): Date{
        return this.props.updated_at
    }

    static create(id: string, props: ProductCreateProps): Product{
        if(!id){
            throw new Error(`[ERROR][PRODUCT]: ID NOT FOUND`)
        }
        if(props.name === undefined || props.name === null || props.name.trim().length === 0){
            throw new Error(`[ERROR][PRODUCT]: PRODUCT NAME IS REQUIRED.`)
        }
        if(props.category === undefined || props.category === null){
            throw new Error(`[ERROR][PRODUCT]: CATEGORY IS REQUIRED`)
        }
        const category = Category.create(props.category)

        return new Product(id, {
            name: props.name,
            category,
            image_url: props.image_url,
            image_path: props.image_path,
            description: props.description,
            created_at: props.created_at,
            updated_at: props.updated_at
        })
    }

    static fromPersistence(id: string, props: ProductCreateProps): Product{
        return Product.create(id, { ...props})
    }
}