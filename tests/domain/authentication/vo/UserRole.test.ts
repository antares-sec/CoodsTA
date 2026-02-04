import { UserRole } from '../../../../src/module/domain/authentication/vo/UserRole';

describe('UserRole ValueObject', () => {
    describe('create', () => {
        it('should create ADMIN role', () => {
            const role = UserRole.create('ADMIN');

            expect(role.value).toBe('ADMIN');
        });

        it('should create USER role', () => {
            const role = UserRole.create('USER');

            expect(role.value).toBe('USER');
        });

        it('should handle lowercase input for ADMIN', () => {
            const role = UserRole.create('admin');

            expect(role.value).toBe('ADMIN');
        });

        it('should handle lowercase input for USER', () => {
            const role = UserRole.create('user');

            expect(role.value).toBe('USER');
        });

        it('should handle mixed case input', () => {
            const role = UserRole.create('AdMiN');

            expect(role.value).toBe('ADMIN');
        });

        it('should throw error for invalid role', () => {
            expect(() => UserRole.create('SUPERADMIN')).toThrow('[ERROR][ROLE]: INVALID ROLE. MUST BE ONE OF: ADMIN,USER');
        });

        it('should throw error for empty role', () => {
            expect(() => UserRole.create('')).toThrow();
        });

        it('should throw error for random string', () => {
            expect(() => UserRole.create('guest')).toThrow('[ERROR][ROLE]: INVALID ROLE. MUST BE ONE OF: ADMIN,USER');
        });
    });

    describe('static factory methods', () => {
        describe('user', () => {
            it('should create USER role', () => {
                const role = UserRole.user();

                expect(role.value).toBe('USER');
            });

            it('should return isUser true', () => {
                const role = UserRole.user();

                expect(role.isUser()).toBe(true);
                expect(role.isAdmin()).toBe(false);
            });
        });

        describe('admin', () => {
            it('should create ADMIN role', () => {
                const role = UserRole.admin();

                expect(role.value).toBe('ADMIN');
            });

            it('should return isAdmin true', () => {
                const role = UserRole.admin();

                expect(role.isAdmin()).toBe(true);
                expect(role.isUser()).toBe(false);
            });
        });
    });

    describe('isAdmin', () => {
        it('should return true for ADMIN role', () => {
            const role = UserRole.create('ADMIN');

            expect(role.isAdmin()).toBe(true);
        });

        it('should return false for USER role', () => {
            const role = UserRole.create('USER');

            expect(role.isAdmin()).toBe(false);
        });
    });

    describe('isUser', () => {
        it('should return true for USER role', () => {
            const role = UserRole.create('USER');

            expect(role.isUser()).toBe(true);
        });

        it('should return false for ADMIN role', () => {
            const role = UserRole.create('ADMIN');

            expect(role.isUser()).toBe(false);
        });
    });

    describe('equals', () => {
        it('should return true for roles with same value', () => {
            const role1 = UserRole.create('ADMIN');
            const role2 = UserRole.create('ADMIN');

            expect(role1.equals(role2)).toBe(true);
        });

        it('should return true for roles created with different cases', () => {
            const role1 = UserRole.create('admin');
            const role2 = UserRole.create('ADMIN');

            expect(role1.equals(role2)).toBe(true);
        });

        it('should return false for different roles', () => {
            const role1 = UserRole.create('ADMIN');
            const role2 = UserRole.create('USER');

            expect(role1.equals(role2)).toBe(false);
        });

        it('should return true for factory created roles with same type', () => {
            const role1 = UserRole.admin();
            const role2 = UserRole.admin();

            expect(role1.equals(role2)).toBe(true);
        });

        it('should return true for factory and create with same type', () => {
            const role1 = UserRole.user();
            const role2 = UserRole.create('USER');

            expect(role1.equals(role2)).toBe(true);
        });
    });

    describe('value getter', () => {
        it('should return the role value', () => {
            const role = UserRole.create('ADMIN');
            expect(role.value).toBe('ADMIN');
        });
    });
});
