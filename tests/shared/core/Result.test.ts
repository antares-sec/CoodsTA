import { Result } from '../../../src/shared/core/Result';

// Concrete implementation for testing since Result is abstract
class TestResult extends Result {
    constructor(message: string) {
        super(message);
    }

    getMessage(): string {
        return this.message;
    }
}

describe('Result', () => {
    describe('constructor', () => {
        it('should create a result with a message', () => {
            const result = new TestResult('Test message');

            expect(result.getMessage()).toBe('Test message');
        });

        it('should store empty message', () => {
            const result = new TestResult('');

            expect(result.getMessage()).toBe('');
        });
    });

    describe('fail', () => {
        it('should throw an error with the message', () => {
            const result = new TestResult('Something went wrong');

            expect(() => result.fail()).toThrow('[ERROR]Something went wrong');
        });

        it('should include ERROR prefix in the error message', () => {
            const result = new TestResult('Validation failed');

            expect(() => result.fail()).toThrow('[ERROR]Validation failed');
        });
    });

    describe('success', () => {
        it('should log success message to console', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const result = new TestResult('Operation completed');

            result.success();

            expect(consoleSpy).toHaveBeenCalledWith('[SUCCESS]Operation completed');
            consoleSpy.mockRestore();
        });

        it('should include SUCCESS prefix in the log', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const result = new TestResult('Done');

            result.success();

            expect(consoleSpy).toHaveBeenCalledWith('[SUCCESS]Done');
            consoleSpy.mockRestore();
        });
    });
});
