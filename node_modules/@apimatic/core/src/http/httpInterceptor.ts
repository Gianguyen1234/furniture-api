import {
  HttpInterceptorInterface,
  HttpCallExecutor,
  combineHttpInterceptors,
} from '@apimatic/core-interfaces';
/**
 * Calls HTTP interceptor chain
 *
 * @param interceptors HTTP interceptor chain
 * @param client Terminating HTTP handler
 */
export function callHttpInterceptors<T>(
  interceptors: Array<HttpInterceptorInterface<T>>,
  client: HttpCallExecutor<T>
): HttpCallExecutor<T> {
  return (request, options) =>
    combineHttpInterceptors(interceptors)(request, options, client);
}
