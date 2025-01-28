import {
  AuthenticatorInterface,
  passThroughInterceptor,
} from '@apimatic/core-interfaces';
import { mergeHeaders } from '@apimatic/http-headers';

export const customHeaderAuthenticationProvider = (
  customHeaderParams: Record<string, string>
): AuthenticatorInterface<boolean> => {
  return (requiresAuth?: boolean) => {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }

    return (request, options, next) => {
      request.headers = request.headers ?? {};
      mergeHeaders(request.headers, customHeaderParams);

      return next(request, options);
    };
  };
};
