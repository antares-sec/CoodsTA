import { HashService } from '../../src/module/infrastructure/hash/HashService';

describe('HashService', () => {
    describe('constructor', () => {
        it('should create service with default salt rounds', () => {
            const service = new HashService();
            expect(service).toBeDefined();
        });

        it('should create service with custom salt rounds', () => {
            const service = new HashService({ saltRounds: 12 });
            expect(service).toBeDefined();
        });
    });

    describe('hash', () => {
        it('should hash a plain text password', async () => {
            const service = new HashService();
            const hash = await service.hash('password123');

            expect(hash).toBeDefined();
            expect(hash).not.toBe('password123');
            expect(hash.startsWith('$2')).toBe(true); // bcrypt format
        });

        it('should generate different hashes for same password', async () => {
            const service = new HashService();
            const hash1 = await service.hash('password123');
            const hash2 = await service.hash('password123');

            expect(hash1).not.toBe(hash2);
        });

        it('should throw error for empty password', async () => {
            const service = new HashService();

            await expect(service.hash('')).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });

        it('should throw error for whitespace only password', async () => {
            const service = new HashService();

            await expect(service.hash('   ')).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });

        it('should throw error for null password', async () => {
            const service = new HashService();

            await expect(service.hash(null as any)).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });

        it('should throw error for undefined password', async () => {
            const service = new HashService();

            await expect(service.hash(undefined as any)).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });

        it('should hash password with special characters', async () => {
            const service = new HashService();
            const hash = await service.hash('P@ssw0rd!#$%^&*()');

            expect(hash).toBeDefined();
            expect(hash.startsWith('$2')).toBe(true);
        });

        it('should hash very long password', async () => {
            const service = new HashService();
            const longPassword = 'a'.repeat(100);
            const hash = await service.hash(longPassword);

            expect(hash).toBeDefined();
        });
    });

    describe('compare', () => {
        it('should return true for matching password', async () => {
            const service = new HashService();
            const password = 'password123';
            const hash = await service.hash(password);

            const isMatch = await service.compare(password, hash);

            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching password', async () => {
            const service = new HashService();
            const hash = await service.hash('password123');

            const isMatch = await service.compare('wrongpassword', hash);

            expect(isMatch).toBe(false);
        });

        it('should return false for empty plain text', async () => {
            const service = new HashService();
            const hash = await service.hash('password123');

            const isMatch = await service.compare('', hash);

            expect(isMatch).toBe(false);
        });

        it('should return false for null plain text', async () => {
            const service = new HashService();
            const hash = await service.hash('password123');

            const isMatch = await service.compare(null as any, hash);

            expect(isMatch).toBe(false);
        });

        it('should return false for empty hash', async () => {
            const service = new HashService();

            const isMatch = await service.compare('password123', '');

            expect(isMatch).toBe(false);
        });

        it('should return false for null hash', async () => {
            const service = new HashService();

            const isMatch = await service.compare('password123', null as any);

            expect(isMatch).toBe(false);
        });

        it('should be case sensitive', async () => {
            const service = new HashService();
            const hash = await service.hash('Password123');

            const isMatch = await service.compare('password123', hash);

            expect(isMatch).toBe(false);
        });
    });

    describe('generateSalt', () => {
        it('should generate a salt', async () => {
            const service = new HashService();
            const salt = await service.generateSalt();

            expect(salt).toBeDefined();
            expect(typeof salt).toBe('string');
            expect(salt.startsWith('$2')).toBe(true);
        });

        it('should generate different salts each time', async () => {
            const service = new HashService();
            const salt1 = await service.generateSalt();
            const salt2 = await service.generateSalt();

            expect(salt1).not.toBe(salt2);
        });
    });

    describe('hashWithSalt', () => {
        it('should hash with provided salt', async () => {
            const service = new HashService();
            const salt = await service.generateSalt();
            const hash = await service.hashWithSalt('password123', salt);

            expect(hash).toBeDefined();
            expect(hash.startsWith('$2')).toBe(true);
        });

        it('should generate same hash with same salt', async () => {
            const service = new HashService();
            const salt = await service.generateSalt();
            const hash1 = await service.hashWithSalt('password123', salt);
            const hash2 = await service.hashWithSalt('password123', salt);

            expect(hash1).toBe(hash2);
        });

        it('should throw error for empty password', async () => {
            const service = new HashService();
            const salt = await service.generateSalt();

            await expect(service.hashWithSalt('', salt)).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });

        it('should throw error for whitespace only password', async () => {
            const service = new HashService();
            const salt = await service.generateSalt();

            await expect(service.hashWithSalt('   ', salt)).rejects.toThrow('[ERROR][HASH]: Plain text is required');
        });
    });

    describe('isHashed', () => {
        it('should return true for bcrypt hash', () => {
            const service = new HashService();

            expect(service.isHashed('$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')).toBe(true);
        });

        it('should return true for $2a$ hash', () => {
            const service = new HashService();

            expect(service.isHashed('$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')).toBe(true);
        });

        it('should return true for $2y$ hash', () => {
            const service = new HashService();

            expect(service.isHashed('$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')).toBe(true);
        });

        it('should return false for plain text', () => {
            const service = new HashService();

            expect(service.isHashed('password123')).toBe(false);
        });

        it('should return false for empty string', () => {
            const service = new HashService();

            expect(service.isHashed('')).toBe(false);
        });

        it('should return false for invalid bcrypt format', () => {
            const service = new HashService();

            expect(service.isHashed('$2x$10$invalid')).toBe(false);
        });

        it('should return false for hash with wrong length', () => {
            const service = new HashService();

            expect(service.isHashed('$2b$10$tooshort')).toBe(false);
        });

        it('should validate hash generated by service', async () => {
            const service = new HashService();
            const hash = await service.hash('password123');

            expect(service.isHashed(hash)).toBe(true);
        });
    });
});
