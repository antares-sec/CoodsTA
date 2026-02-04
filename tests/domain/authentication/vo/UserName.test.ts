import { UserName } from '../../../../src/module/domain/authentication/vo/UserName';

describe('UserName ValueObject', () => {
    describe('create', () => {
        it('should create a valid username', () => {
            const userName = UserName.create('John Doe');

            expect(userName.value).toBe('John Doe');
        });

        it('should trim whitespace from username', () => {
            const userName = UserName.create('  John Doe  ');

            expect(userName.value).toBe('John Doe');
        });

        it('should throw error for empty username', () => {
            expect(() => UserName.create('')).toThrow('[ERROR][USERNAME]: Name is required');
        });

        it('should throw error for null username', () => {
            expect(() => UserName.create(null as any)).toThrow('[ERROR][USERNAME]: Name is required');
        });

        it('should throw error for undefined username', () => {
            expect(() => UserName.create(undefined as any)).toThrow('[ERROR][USERNAME]: Name is required');
        });

        it('should throw error for whitespace only username', () => {
            expect(() => UserName.create('   ')).toThrow('[ERROR][USERNAME]: Name is required');
        });

        it('should throw error for username shorter than 2 characters', () => {
            expect(() => UserName.create('A')).toThrow('[ERROR][USERNAME]: Name must be at least 2 characters');
        });

        it('should accept username with exactly 2 characters', () => {
            const userName = UserName.create('Jo');
            expect(userName.value).toBe('Jo');
        });

        it('should accept username with exactly 100 characters', () => {
            const longName = 'a'.repeat(100);
            const userName = UserName.create(longName);
            expect(userName.value).toBe(longName);
        });

        it('should throw error for username longer than 100 characters', () => {
            const tooLongName = 'a'.repeat(101);
            expect(() => UserName.create(tooLongName)).toThrow('[ERROR][USERNAME]: Name must not exceed 100 characters');
        });

        it('should accept username with special characters', () => {
            const userName = UserName.create("John O'Brien-Smith");
            expect(userName.value).toBe("John O'Brien-Smith");
        });

        it('should accept username with numbers', () => {
            const userName = UserName.create('User123');
            expect(userName.value).toBe('User123');
        });

        it('should accept username with unicode characters', () => {
            const userName = UserName.create('José García');
            expect(userName.value).toBe('José García');
        });
    });

    describe('edge cases', () => {
        it('should handle trimmed username at minimum length boundary', () => {
            const userName = UserName.create('  AB  ');
            expect(userName.value).toBe('AB');
        });

        it('should reject trimmed username below minimum length', () => {
            expect(() => UserName.create('  A  ')).toThrow('[ERROR][USERNAME]: Name must be at least 2 characters');
        });

        it('should handle trimmed username at maximum length boundary', () => {
            const nameWithSpaces = '  ' + 'a'.repeat(100) + '  ';
            const userName = UserName.create(nameWithSpaces);
            expect(userName.value).toBe('a'.repeat(100));
        });
    });

    describe('equals', () => {
        it('should return true for usernames with same value', () => {
            const name1 = UserName.create('John Doe');
            const name2 = UserName.create('John Doe');

            expect(name1.equals(name2)).toBe(true);
        });

        it('should return false for usernames with different values', () => {
            const name1 = UserName.create('John Doe');
            const name2 = UserName.create('Jane Doe');

            expect(name1.equals(name2)).toBe(false);
        });

        it('should return true for usernames that become equal after trimming', () => {
            const name1 = UserName.create('  John Doe  ');
            const name2 = UserName.create('John Doe');

            expect(name1.equals(name2)).toBe(true);
        });

        it('should be case sensitive', () => {
            const name1 = UserName.create('John Doe');
            const name2 = UserName.create('john doe');

            expect(name1.equals(name2)).toBe(false);
        });
    });

    describe('value getter', () => {
        it('should return the username value', () => {
            const userName = UserName.create('Test User');
            expect(userName.value).toBe('Test User');
        });
    });
});
