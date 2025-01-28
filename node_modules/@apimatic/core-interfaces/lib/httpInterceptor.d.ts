import { HttpRequest } from './httpRequest';
import { HttpContext } from './httpContext';
/**
 * Interface for a method that executes an HTTP request and returns the HTTP context.
 *
 * The context contains the HTTP response and the HTTP request (which may or may not be the same
 * as the original HTTP request).
 */
export type HttpCallExecutor<T> = (request: HttpRequest, requestOptions: T) => Promise<HttpContext>;
/**
 * Interface representing an HTTP interceptor method.
 *
 * HTTP interceptors are used to extend the HTTP call pipeline with new behavior or
 * features.
 *
 * An HTTP interceptor receives an HTTP request. It can modify the
 * HTTP request and then pass it along to the next HTTP interceptor in the chain which
 * then returns an HTTP response. It then returns this HTTP response, after optionally
 * modifying it.
 */
export type HttpInterceptorInterface<T> = (request: HttpRequest, requestOptions: T, next: HttpCallExecutor<T>) => Promise<HttpContext>;
/** Pass-through HTTP interceptor. */
export declare function passThroughInterceptor<T>(request: HttpRequest, requestOptions: T, next: HttpCallExecutor<T>): Promise<HttpContext>;
/**
 * Combine multiple HTTP interceptors into one.
 */
export declare function combineHttpInterceptors<T>(interceptors: Array<HttpInterceptorInterface<T | undefined>>): HttpInterceptorInterface<T | undefined>;
//# sourceMappingURL=httpInterceptor.d.ts.map