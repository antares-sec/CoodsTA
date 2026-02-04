/**
 * HTTP Request and Response types for controllers
 */

export interface HttpRequest {
    body: any;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string>;
    file?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    } | undefined;
    user?: {
        userId: string;
        email: string;
        role: string;
    } | undefined;
}

export interface HttpResponse {
    statusCode: number;
    body: any;
}

// Response helpers
export const ok = (data: any): HttpResponse => ({ statusCode: 200, body: data });
export const created = (data: any): HttpResponse => ({ statusCode: 201, body: data });
export const badRequest = (error: string): HttpResponse => ({ statusCode: 400, body: { error } });
export const unauthorized = (error: string = 'Unauthorized'): HttpResponse => ({ statusCode: 401, body: { error } });
export const forbidden = (error: string = 'Forbidden'): HttpResponse => ({ statusCode: 403, body: { error } });
export const notFound = (error: string = 'Not found'): HttpResponse => ({ statusCode: 404, body: { error } });
export const serverError = (error: string = 'Internal server error'): HttpResponse => ({ statusCode: 500, body: { error } });
