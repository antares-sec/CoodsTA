import { ValueObject } from "../../../../shared/core/ValueObject";

type AccuracyValue = number; // 0-100

interface AccuracyProps {
    value: AccuracyValue;
}

export class Accuracy extends ValueObject<AccuracyProps> {
    private constructor(props: AccuracyProps) {
        super(props);
    }

    get value(): AccuracyValue {
        return this.props.value;
    }

    public isHighAccuracy(): boolean {
        return this.props.value >= 90;
    }

    public isMediumAccuracy(): boolean {
        return this.props.value >= 70 && this.props.value < 90;
    }

    public isLowAccuracy(): boolean {
        return this.props.value < 70;
    }

    public static create(accuracy: number): Accuracy {
        if (accuracy < 0 || accuracy > 100) {
            throw new Error(`[ERROR][ACCURACY]: Accuracy must be between 0 and 100. Received: ${accuracy}`);
        }
        if (!Number.isFinite(accuracy)) {
            throw new Error(`[ERROR][ACCURACY]: Accuracy must be a valid number.`);
        }
        return new Accuracy({ value: accuracy });
    }
}
