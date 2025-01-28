import { __values } from 'tslib';
import { passThroughInterceptor } from '@apimatic/core-interfaces';
var customQueryAuthenticationProvider = function (customQueryParams) {
  return function (requiresAuth) {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }
    return function (request, options, next) {
      request.url += (request.url.indexOf('?') === -1 ? '?' : '&') + encodeQueryParams(customQueryParams);
      return next(request, options);
    };
  };
};
function encodeQueryParams(queryParams) {
  var e_1, _a;
  var queryString = [];
  try {
    for (var _b = __values(Object.keys(queryParams)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      queryString.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(queryParams[key])));
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  return queryString.join('&');
}
export { customQueryAuthenticationProvider };