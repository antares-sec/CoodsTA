import { Email } from '../../../../src/module/domain/authentication/vo/Email';

describe('Email ValueObject', () => {
    describe('create', () => {
        it('should create a valid email', () => {
            const email = Email.create('test@example.com');

            expect(email.value).toBe('test@example.com');
        });

        it('should convert email to lowercase', () => {
            const email = Email.create('Test@EXAMPLE.COM');

            expect(email.value).toBe('test@example.com');
        });

        it('should throw error for email with leading/trailing spaces', () => {
            // The regex validates before trimming, so spaces cause invalid format
            expect(() => Email.create('  test@example.com  ')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for empty email', () => {
            expect(() => Email.create('')).toThrow('[ERROR][EMAIL]: Email is required');
        });

        it('should throw error for null email', () => {
            expect(() => Email.create(null as any)).toThrow('[ERROR][EMAIL]: Email is required');
        });

        it('should throw error for undefined email', () => {
            expect(() => Email.create(undefined as any)).toThrow('[ERROR][EMAIL]: Email is required');
        });

        it('should throw error for whitespace only email', () => {
            expect(() => Email.create('   ')).toThrow('[ERROR][EMAIL]: Email is required');
        });

        it('should throw error for email without @', () => {
            expect(() => Email.create('testexample.com')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for email without domain', () => {
            expect(() => Email.create('test@')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for email without local part', () => {
            expect(() => Email.create('@example.com')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for email without TLD', () => {
            expect(() => Email.create('test@example')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });

        it('should throw error for email with spaces', () => {
            expect(() => Email.create('test @example.com')).toThrow('[ERROR][EMAIL]: Invalid email format');
        });
    });

    describe('valid email formats', () => {
        it('should accept standard email format', () => {
            const email = Email.create('user@domain.com');
            expect(email.value).toBe('user@domain.com');
        });

        it('should accept email with subdomain', () => {
            const email = Email.create('user@mail.domain.com');
            expect(email.value).toBe('user@mail.domain.com');
        });

        it('should accept email with dots in local part', () => {
            const email = Email.create('first.last@domain.com');
            expect(email.value).toBe('first.last@domain.com');
        });

        it('should accept email with numbers', () => {
            const email = Email.create('user123@domain123.com');
            expect(email.value).toBe('user123@domain123.com');
        });

        it('should accept email with plus sign', () => {
            const email = Email.create('user+tag@domain.com');
            expect(email.value).toBe('user+tag@domain.com');
        });

        it('should accept email with underscore', () => {
            const email = Email.create('user_name@domain.com');
            expect(email.value).toBe('user_name@domain.com');
        });

        it('should accept email with hyphen in domain', () => {
            const email = Email.create('user@my-domain.com');
            expect(email.value).toBe('user@my-domain.com');
        });
    });

    describe('equals', () => {
        it('should return true for emails with same value', () => {
            const email1 = Email.create('test@example.com');
            const email2 = Email.create('test@example.com');

            expect(email1.equals(email2)).toBe(true);
        });

        it('should return true for emails with same value different case', () => {
            const email1 = Email.create('test@example.com');
            const email2 = Email.create('TEST@EXAMPLE.COM');

            expect(email1.equals(email2)).toBe(true);
        });

        it('should return false for emails with different values', () => {
            const email1 = Email.create('test1@example.com');
            const email2 = Email.create('test2@example.com');

            expect(email1.equals(email2)).toBe(false);
        });
    });
});
