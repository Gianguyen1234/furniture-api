/// <reference types="node" />
import { ApiResponse, HttpContext, HttpRequest } from '@apimatic/core-interfaces';
/**
 * Thrown when the HTTP status code is not okay.
 *
 * The ApiError extends the ApiResponse interface, so all ApiResponse
 * properties are available.
 */
export declare class ApiError<T = {}> extends Error implements ApiResponse<T | undefined> {
    request: HttpRequest;
    statusCode: number;
    headers: Record<string, string>;
    result: T | undefined;
    body: string | Blob | NodeJS.ReadableStream;
    constructor(context: HttpContext, message: string);
}
//# sourceMappingURL=apiError.d.ts.map