import bcrypt from 'bcrypt';

export interface HashConfig {
    saltRounds: number;
}

/**
 * HashService - Infrastructure service for password hashing
 * 
 * Handles:
 * - Password hashing with bcrypt
 * - Password verification
 * - Salt generation
 */
export class HashService {
    private readonly saltRounds: number;

    constructor(config?: Partial<HashConfig>) {
        this.saltRounds = config?.saltRounds || 10;
    }

    /**
     * Hash a plain text password
     */
    public async hash(plainText: string): Promise<string> {
        if (!plainText || plainText.trim().length === 0) {
            throw new Error('[ERROR][HASH]: Plain text is required');
        }
        const salt = await bcrypt.genSalt(this.saltRounds);
        return bcrypt.hash(plainText, salt);
    }

    /**
     * Compare a plain text password with a hashed password
     */
    public async compare(plainText: string, hashedText: string): Promise<boolean> {
        if (!plainText || !hashedText) {
            return false;
        }
        return bcrypt.compare(plainText, hashedText);
    }

    /**
     * Generate a salt
     */
    public async generateSalt(): Promise<string> {
        return bcrypt.genSalt(this.saltRounds);
    }

    /**
     * Hash with a specific salt
     */
    public async hashWithSalt(plainText: string, salt: string): Promise<string> {
        if (!plainText || plainText.trim().length === 0) {
            throw new Error('[ERROR][HASH]: Plain text is required');
        }
        return bcrypt.hash(plainText, salt);
    }

    /**
     * Check if a string is already hashed (bcrypt format)
     */
    public isHashed(text: string): boolean {
        // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are 60 characters long
        const bcryptRegex = /^\$2[aby]\$\d{2}\$.{53}$/;
        return bcryptRegex.test(text);
    }
}

// Singleton instance for convenience
const hashService = new HashService();
export default hashService;
