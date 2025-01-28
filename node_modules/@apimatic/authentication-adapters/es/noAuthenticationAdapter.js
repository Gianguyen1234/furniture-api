import { passThroughInterceptor } from '@apimatic/core-interfaces';

/** None authentication provider */
var noneAuthenticationProvider = function () {
  return passThroughInterceptor;
};
export { noneAuthenticationProvider };