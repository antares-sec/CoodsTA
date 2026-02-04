import { ok, created, badRequest, unauthorized, forbidden, notFound, serverError } from '../../src/module/interface/http/HttpTypes';

describe('HttpTypes', () => {
    describe('ok', () => {
        it('should return 200 status code with data', () => {
            const data = { message: 'Success', data: [1, 2, 3] };
            const response = ok(data);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(data);
        });

        it('should handle null data', () => {
            const response = ok(null);

            expect(response.statusCode).toBe(200);
            expect(response.body).toBeNull();
        });
    });

    describe('created', () => {
        it('should return 201 status code with data', () => {
            const data = { id: '123', name: 'New Resource' };
            const response = created(data);

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(data);
        });
    });

    describe('badRequest', () => {
        it('should return 400 status code with error message', () => {
            const response = badRequest('Invalid input');

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid input' });
        });
    });

    describe('unauthorized', () => {
        it('should return 401 status code with default message', () => {
            const response = unauthorized();

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return 401 status code with custom message', () => {
            const response = unauthorized('Token expired');

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ error: 'Token expired' });
        });
    });

    describe('forbidden', () => {
        it('should return 403 status code with default message', () => {
            const response = forbidden();

            expect(response.statusCode).toBe(403);
            expect(response.body).toEqual({ error: 'Forbidden' });
        });

        it('should return 403 status code with custom message', () => {
            const response = forbidden('Access denied');

            expect(response.statusCode).toBe(403);
            expect(response.body).toEqual({ error: 'Access denied' });
        });
    });

    describe('notFound', () => {
        it('should return 404 status code with default message', () => {
            const response = notFound();

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });

        it('should return 404 status code with custom message', () => {
            const response = notFound('Resource not found');

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: 'Resource not found' });
        });
    });

    describe('serverError', () => {
        it('should return 500 status code with default message', () => {
            const response = serverError();

            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({ error: 'Internal server error' });
        });

        it('should return 500 status code with custom message', () => {
            const response = serverError('Database connection failed');

            expect(response.statusCode).toBe(500);
            expect(response.body).toEqual({ error: 'Database connection failed' });
        });
    });
});
