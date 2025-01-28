import { combineHttpInterceptors } from '@apimatic/core-interfaces';

/**
 * Calls HTTP interceptor chain
 *
 * @param interceptors HTTP interceptor chain
 * @param client Terminating HTTP handler
 */
function callHttpInterceptors(interceptors, client) {
  return function (request, options) {
    return combineHttpInterceptors(interceptors)(request, options, client);
  };
}
export { callHttpInterceptors };