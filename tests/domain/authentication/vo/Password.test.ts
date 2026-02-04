import { Password } from '../../../../src/module/domain/authentication/vo/Password';

describe('Password ValueObject', () => {
    describe('create', () => {
        it('should create a valid password', () => {
            const password = Password.create('mypassword123');

            expect(password.value).toBe('mypassword123');
            expect(password.isHashed).toBe(false);
        });

        it('should mark password as not hashed', () => {
            const password = Password.create('testPassword');

            expect(password.isHashed).toBe(false);
        });

        it('should throw error for empty password', () => {
            expect(() => Password.create('')).toThrow('[ERROR][PASSWORD] : PASSWORD IS REQUIRED');
        });

        it('should throw error for null password', () => {
            expect(() => Password.create(null as any)).toThrow('[ERROR][PASSWORD] : PASSWORD IS REQUIRED');
        });

        it('should throw error for undefined password', () => {
            expect(() => Password.create(undefined as any)).toThrow('[ERROR][PASSWORD] : PASSWORD IS REQUIRED');
        });

        it('should throw error for whitespace only password', () => {
            expect(() => Password.create('   ')).toThrow('[ERROR][PASSWORD] : PASSWORD IS REQUIRED');
        });

        it('should preserve spaces within password', () => {
            const password = Password.create('pass word');
            expect(password.value).toBe('pass word');
        });

        it('should allow special characters', () => {
            const password = Password.create('P@ssw0rd!#$%');
            expect(password.value).toBe('P@ssw0rd!#$%');
        });

        it('should allow very long passwords', () => {
            const longPassword = 'a'.repeat(1000);
            const password = Password.create(longPassword);
            expect(password.value).toBe(longPassword);
        });
    });

    describe('createHashed', () => {
        it('should create a hashed password', () => {
            const hashedValue = '$2b$10$abcdefghijklmnopqrstuv';
            const password = Password.createHashed(hashedValue);

            expect(password.value).toBe(hashedValue);
            expect(password.isHashed).toBe(true);
        });

        it('should mark password as hashed', () => {
            const password = Password.createHashed('hashed_password_value');

            expect(password.isHashed).toBe(true);
        });

        it('should allow empty hashed password', () => {
            const password = Password.createHashed('');
            expect(password.value).toBe('');
            expect(password.isHashed).toBe(true);
        });

        it('should store bcrypt formatted hash', () => {
            const bcryptHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
            const password = Password.createHashed(bcryptHash);

            expect(password.value).toBe(bcryptHash);
            expect(password.isHashed).toBe(true);
        });
    });

    describe('equals', () => {
        it('should return true for passwords with same value and hash status', () => {
            const password1 = Password.create('testpassword');
            const password2 = Password.create('testpassword');

            expect(password1.equals(password2)).toBe(true);
        });

        it('should return false for passwords with different values', () => {
            const password1 = Password.create('password1');
            const password2 = Password.create('password2');

            expect(password1.equals(password2)).toBe(false);
        });

        it('should return false for passwords with different hash status', () => {
            const password1 = Password.create('password');
            const password2 = Password.createHashed('password');

            expect(password1.equals(password2)).toBe(false);
        });

        it('should return true for hashed passwords with same value', () => {
            const hash = '$2b$10$abcdefg';
            const password1 = Password.createHashed(hash);
            const password2 = Password.createHashed(hash);

            expect(password1.equals(password2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the password value', () => {
            const password = Password.create('mySecretPassword');
            expect(password.value).toBe('mySecretPassword');
        });
    });

    describe('isHashed getter', () => {
        it('should return false for unhashed password', () => {
            const password = Password.create('plaintext');
            expect(password.isHashed).toBe(false);
        });

        it('should return true for hashed password', () => {
            const password = Password.createHashed('hashedvalue');
            expect(password.isHashed).toBe(true);
        });
    });
});
