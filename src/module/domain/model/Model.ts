import { Entity } from "../../../shared/core/Entity";
import { ModelType } from "./vo/ModelType";
import { ModelStatus } from "./vo/ModelStatus";
import { Accuracy } from "./vo/Accuracy";

interface ModelInterface {
    model_type: ModelType;
    version: string;
    file_path: string;
    accuracy: Accuracy;
    deployment_date: Date;
    created_at: Date;
    is_active: ModelStatus;
}

interface ModelCreateProps {
    model_type: string;
    version: string;
    file_path: string;
    accuracy: number;
    deployment_date: Date;
    created_at: Date;
    is_active: string;
}

export class Model extends Entity<ModelInterface> {
    constructor(id: string, props: ModelInterface) {
        super(id, props);
    }

    get id(): string {
        return this._id;
    }

    get modelType(): string {
        return this.props.model_type.value;
    }

    get modelTypeVO(): ModelType {
        return this.props.model_type;
    }

    get version(): string {
        return this.props.version;
    }

    get filePath(): string {
        return this.props.file_path;
    }

    get accuracy(): number {
        return this.props.accuracy.value;
    }

    get accuracyVO(): Accuracy {
        return this.props.accuracy;
    }

    get deploymentDate(): Date {
        return this.props.deployment_date;
    }

    get createdAt(): Date {
        return this.props.created_at;
    }

    get isActive(): string {
        return this.props.is_active.value;
    }

    get isActiveVO(): ModelStatus {
        return this.props.is_active;
    }

    public isModelActive(): boolean {
        return this.props.is_active.isActive();
    }

    static create(id: string, props: ModelCreateProps): Model {
        if (!id) {
            throw new Error(`[ERROR][MODEL]: ID NOT FOUND`);
        }
        if (!props.version || props.version.trim().length === 0) {
            throw new Error(`[ERROR][MODEL]: VERSION IS REQUIRED`);
        }
        if (!props.file_path || props.file_path.trim().length === 0) {
            throw new Error(`[ERROR][MODEL]: FILE PATH IS REQUIRED`);
        }

        const modelType = ModelType.create(props.model_type);
        const accuracy = Accuracy.create(props.accuracy);
        const isActive = ModelStatus.create(props.is_active);

        return new Model(id, {
            model_type: modelType,
            version: props.version,
            file_path: props.file_path,
            accuracy,
            deployment_date: props.deployment_date,
            created_at: props.created_at,
            is_active: isActive
        });
    }

    static fromPersistence(id: string, props: ModelCreateProps): Model {
        return Model.create(id, { ...props });
    }
}
