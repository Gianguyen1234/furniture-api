import { passThroughInterceptor } from '@apimatic/core-interfaces';

/** None authentication provider */
export const noneAuthenticationProvider = () => passThroughInterceptor;
