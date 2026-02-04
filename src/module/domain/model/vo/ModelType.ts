import { ValueObject } from "../../../../shared/core/ValueObject";

type ModelTypeValue = 'DETECTOR' | 'CLASSIFICATOR';

interface ModelTypeProps {
    value: ModelTypeValue;
}

export class ModelType extends ValueObject<ModelTypeProps> {
    private constructor(props: ModelTypeProps) {
        super(props);
    }

    get value(): ModelTypeValue {
        return this.props.value;
    }

    public isDetector(): boolean {
        return this.props.value === 'DETECTOR';
    }

    public isClassificator(): boolean {
        return this.props.value === 'CLASSIFICATOR';
    }

    public static create(type: string): ModelType {
        const validTypes: ModelTypeValue[] = ['DETECTOR', 'CLASSIFICATOR'];
        const upperType = type.toUpperCase() as ModelTypeValue;

        if (!validTypes.includes(upperType)) {
            throw new Error(`[ERROR][MODEL_TYPE]: Invalid model type. Must be DETECTOR or CLASSIFICATOR.`);
        }
        return new ModelType({ value: upperType });
    }

    public static detector(): ModelType {
        return new ModelType({ value: 'DETECTOR' });
    }

    public static classificator(): ModelType {
        return new ModelType({ value: 'CLASSIFICATOR' });
    }
}
