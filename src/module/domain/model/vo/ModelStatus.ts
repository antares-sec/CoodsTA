import { ValueObject } from "../../../../shared/core/ValueObject";

type ModelStatusValue = 'ACTIVE' | 'DEACTIVATED';

interface ModelStatusProps {
    value: ModelStatusValue;
}

export class ModelStatus extends ValueObject<ModelStatusProps> {
    private constructor(props: ModelStatusProps) {
        super(props);
    }

    get value(): ModelStatusValue {
        return this.props.value;
    }

    public isActive(): boolean {
        return this.props.value === 'ACTIVE';
    }

    public isDeactivated(): boolean {
        return this.props.value === 'DEACTIVATED';
    }

    public static create(status: string): ModelStatus {
        const validStatuses: ModelStatusValue[] = ['ACTIVE', 'DEACTIVATED'];
        const upperStatus = status.toUpperCase() as ModelStatusValue;

        if (!validStatuses.includes(upperStatus)) {
            throw new Error(`[ERROR][MODEL_STATUS]: Invalid status. Must be ACTIVE or DEACTIVATED.`);
        }
        return new ModelStatus({ value: upperStatus });
    }

    public static active(): ModelStatus {
        return new ModelStatus({ value: 'ACTIVE' });
    }

    public static deactivated(): ModelStatus {
        return new ModelStatus({ value: 'DEACTIVATED' });
    }
}
