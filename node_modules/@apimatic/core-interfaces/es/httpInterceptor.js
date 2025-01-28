/** Pass-through HTTP interceptor. */
function passThroughInterceptor(request, requestOptions, next) {
  return next(request, requestOptions);
}
/**
 * Combine multiple HTTP interceptors into one.
 */
function combineHttpInterceptors(interceptors) {
  return function (firstRequest, firstOptions, next) {
    var _loop_1 = function (index) {
      var current = interceptors[index];
      var last = next;
      next = function (request, options) {
        return current(request, options, last);
      };
    };
    for (var index = interceptors.length - 1; index >= 0; index--) {
      _loop_1(index);
    }
    return next(firstRequest, firstOptions);
  };
}
export { combineHttpInterceptors, passThroughInterceptor };