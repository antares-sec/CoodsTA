import { ValueObject } from "../../../../shared/core/ValueObject";

type ConfidenceScoreType = number; // 0-100

interface ConfidenceScoreProps {
    value: ConfidenceScoreType;
}

export class ConfidenceScore extends ValueObject<ConfidenceScoreProps> {
    private constructor(props: ConfidenceScoreProps) {
        super(props);
    }

    get value(): ConfidenceScoreType {
        return this.props.value;
    }

    public isHighConfidence(): boolean {
        return this.props.value >= 80;
    }

    public isMediumConfidence(): boolean {
        return this.props.value >= 50 && this.props.value < 80;
    }

    public isLowConfidence(): boolean {
        return this.props.value < 50;
    }

    public static create(score: number): ConfidenceScore {
        if (score < 0 || score > 100) {
            throw new Error(`[ERROR][CONFIDENCE_SCORE]: Score must be between 0 and 100. Received: ${score}`);
        }
        if (!Number.isFinite(score)) {
            throw new Error(`[ERROR][CONFIDENCE_SCORE]: Score must be a valid number.`);
        }
        return new ConfidenceScore({ value: score });
    }
}