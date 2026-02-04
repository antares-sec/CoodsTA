import { Authenticity } from '../../../../src/module/domain/report/vo/AuthenticityResult';

describe('Authenticity ValueObject', () => {
    describe('create', () => {
        it('should create GENUINE authenticity', () => {
            const authenticity = Authenticity.create('GENUINE');

            expect(authenticity.value).toBe('GENUINE');
        });

        it('should create COUNTERFEIT authenticity', () => {
            const authenticity = Authenticity.create('COUNTERFEIT');

            expect(authenticity.value).toBe('COUNTERFEIT');
        });

        it('should handle lowercase input for GENUINE', () => {
            const authenticity = Authenticity.create('genuine');

            expect(authenticity.value).toBe('GENUINE');
        });

        it('should handle lowercase input for COUNTERFEIT', () => {
            const authenticity = Authenticity.create('counterfeit');

            expect(authenticity.value).toBe('COUNTERFEIT');
        });

        it('should handle mixed case input', () => {
            const authenticity = Authenticity.create('GeNuInE');

            expect(authenticity.value).toBe('GENUINE');
        });

        it('should throw error for invalid authenticity', () => {
            expect(() => Authenticity.create('UNKNOWN')).toThrow('[ERROR][AUTHENTICITY]: INVALID AUTHENTICITY TYPE');
        });

        it('should throw error for empty authenticity', () => {
            expect(() => Authenticity.create('')).toThrow();
        });

        it('should throw error for random string', () => {
            expect(() => Authenticity.create('fake')).toThrow('[ERROR][AUTHENTICITY]: INVALID AUTHENTICITY TYPE');
        });
    });

    describe('static factory methods', () => {
        describe('genuine', () => {
            it('should create GENUINE authenticity', () => {
                const authenticity = Authenticity.genuine();

                expect(authenticity.value).toBe('GENUINE');
            });

            it('should return isGenuine true', () => {
                const authenticity = Authenticity.genuine();

                expect(authenticity.isGenuine()).toBe(true);
                expect(authenticity.isCounterfeit()).toBe(false);
            });
        });

        describe('counterfeit', () => {
            it('should create COUNTERFEIT authenticity', () => {
                const authenticity = Authenticity.counterfeit();

                expect(authenticity.value).toBe('COUNTERFEIT');
            });

            it('should return isCounterfeit true', () => {
                const authenticity = Authenticity.counterfeit();

                expect(authenticity.isCounterfeit()).toBe(true);
                expect(authenticity.isGenuine()).toBe(false);
            });
        });
    });

    describe('isGenuine', () => {
        it('should return true for GENUINE authenticity', () => {
            const authenticity = Authenticity.create('GENUINE');

            expect(authenticity.isGenuine()).toBe(true);
        });

        it('should return false for COUNTERFEIT authenticity', () => {
            const authenticity = Authenticity.create('COUNTERFEIT');

            expect(authenticity.isGenuine()).toBe(false);
        });
    });

    describe('isCounterfeit', () => {
        it('should return true for COUNTERFEIT authenticity', () => {
            const authenticity = Authenticity.create('COUNTERFEIT');

            expect(authenticity.isCounterfeit()).toBe(true);
        });

        it('should return false for GENUINE authenticity', () => {
            const authenticity = Authenticity.create('GENUINE');

            expect(authenticity.isCounterfeit()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for authenticities with same value', () => {
            const auth1 = Authenticity.create('GENUINE');
            const auth2 = Authenticity.create('GENUINE');

            expect(auth1.equals(auth2)).toBe(true);
        });

        it('should return true for authenticities created with different cases', () => {
            const auth1 = Authenticity.create('genuine');
            const auth2 = Authenticity.create('GENUINE');

            expect(auth1.equals(auth2)).toBe(true);
        });

        it('should return false for different authenticities', () => {
            const auth1 = Authenticity.create('GENUINE');
            const auth2 = Authenticity.create('COUNTERFEIT');

            expect(auth1.equals(auth2)).toBe(false);
        });

        it('should return true for factory created authenticities with same type', () => {
            const auth1 = Authenticity.genuine();
            const auth2 = Authenticity.genuine();

            expect(auth1.equals(auth2)).toBe(true);
        });

        it('should return true for factory and create with same type', () => {
            const auth1 = Authenticity.counterfeit();
            const auth2 = Authenticity.create('COUNTERFEIT');

            expect(auth1.equals(auth2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the authenticity value', () => {
            const authenticity = Authenticity.create('GENUINE');
            expect(authenticity.value).toBe('GENUINE');
        });
    });
});
