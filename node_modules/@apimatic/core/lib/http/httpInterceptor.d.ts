import { HttpInterceptorInterface, HttpCallExecutor } from '@apimatic/core-interfaces';
/**
 * Calls HTTP interceptor chain
 *
 * @param interceptors HTTP interceptor chain
 * @param client Terminating HTTP handler
 */
export declare function callHttpInterceptors<T>(interceptors: Array<HttpInterceptorInterface<T>>, client: HttpCallExecutor<T>): HttpCallExecutor<T>;
//# sourceMappingURL=httpInterceptor.d.ts.map