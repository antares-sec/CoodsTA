import { ModelStatus } from '../../../../src/module/domain/model/vo/ModelStatus';

describe('ModelStatus ValueObject', () => {
    describe('create', () => {
        it('should create ACTIVE status', () => {
            const status = ModelStatus.create('ACTIVE');

            expect(status.value).toBe('ACTIVE');
        });

        it('should create DEACTIVATED status', () => {
            const status = ModelStatus.create('DEACTIVATED');

            expect(status.value).toBe('DEACTIVATED');
        });

        it('should handle lowercase input for ACTIVE', () => {
            const status = ModelStatus.create('active');

            expect(status.value).toBe('ACTIVE');
        });

        it('should handle lowercase input for DEACTIVATED', () => {
            const status = ModelStatus.create('deactivated');

            expect(status.value).toBe('DEACTIVATED');
        });

        it('should handle mixed case input', () => {
            const status = ModelStatus.create('AcTiVe');

            expect(status.value).toBe('ACTIVE');
        });

        it('should throw error for invalid status', () => {
            expect(() => ModelStatus.create('PENDING')).toThrow('[ERROR][MODEL_STATUS]: Invalid status. Must be ACTIVE or DEACTIVATED.');
        });

        it('should throw error for empty status', () => {
            expect(() => ModelStatus.create('')).toThrow();
        });

        it('should throw error for random string', () => {
            expect(() => ModelStatus.create('enabled')).toThrow('[ERROR][MODEL_STATUS]: Invalid status. Must be ACTIVE or DEACTIVATED.');
        });
    });

    describe('static factory methods', () => {
        describe('active', () => {
            it('should create ACTIVE status', () => {
                const status = ModelStatus.active();

                expect(status.value).toBe('ACTIVE');
            });

            it('should return isActive true', () => {
                const status = ModelStatus.active();

                expect(status.isActive()).toBe(true);
                expect(status.isDeactivated()).toBe(false);
            });
        });

        describe('deactivated', () => {
            it('should create DEACTIVATED status', () => {
                const status = ModelStatus.deactivated();

                expect(status.value).toBe('DEACTIVATED');
            });

            it('should return isDeactivated true', () => {
                const status = ModelStatus.deactivated();

                expect(status.isDeactivated()).toBe(true);
                expect(status.isActive()).toBe(false);
            });
        });
    });

    describe('isActive', () => {
        it('should return true for ACTIVE status', () => {
            const status = ModelStatus.create('ACTIVE');

            expect(status.isActive()).toBe(true);
        });

        it('should return false for DEACTIVATED status', () => {
            const status = ModelStatus.create('DEACTIVATED');

            expect(status.isActive()).toBe(false);
        });
    });

    describe('isDeactivated', () => {
        it('should return true for DEACTIVATED status', () => {
            const status = ModelStatus.create('DEACTIVATED');

            expect(status.isDeactivated()).toBe(true);
        });

        it('should return false for ACTIVE status', () => {
            const status = ModelStatus.create('ACTIVE');

            expect(status.isDeactivated()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for statuses with same value', () => {
            const status1 = ModelStatus.create('ACTIVE');
            const status2 = ModelStatus.create('ACTIVE');

            expect(status1.equals(status2)).toBe(true);
        });

        it('should return true for statuses created with different cases', () => {
            const status1 = ModelStatus.create('active');
            const status2 = ModelStatus.create('ACTIVE');

            expect(status1.equals(status2)).toBe(true);
        });

        it('should return false for different statuses', () => {
            const status1 = ModelStatus.create('ACTIVE');
            const status2 = ModelStatus.create('DEACTIVATED');

            expect(status1.equals(status2)).toBe(false);
        });

        it('should return true for factory created statuses with same type', () => {
            const status1 = ModelStatus.active();
            const status2 = ModelStatus.active();

            expect(status1.equals(status2)).toBe(true);
        });

        it('should return true for factory and create with same type', () => {
            const status1 = ModelStatus.deactivated();
            const status2 = ModelStatus.create('DEACTIVATED');

            expect(status1.equals(status2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the status value', () => {
            const status = ModelStatus.create('ACTIVE');
            expect(status.value).toBe('ACTIVE');
        });
    });
});
