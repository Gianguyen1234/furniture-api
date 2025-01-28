import { passThroughInterceptor } from '@apimatic/core-interfaces';
var basicAuthenticationProvider = function (basicAuthUserName, basicAuthPassword) {
  return function (requiresAuth) {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }
    return function (request, options, next) {
      request.auth = {
        username: basicAuthUserName,
        password: basicAuthPassword
      };
      return next(request, options);
    };
  };
};
export { basicAuthenticationProvider };