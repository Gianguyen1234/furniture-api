import { OAuthToken } from './oAuthToken';
import {
  AuthenticatorInterface,
  passThroughInterceptor,
} from '@apimatic/core-interfaces';
import { AUTHORIZATION_HEADER, setHeader } from '@apimatic/http-headers';
import { OAuthConfiguration } from './oAuthConfiguration';

export const requestAuthenticationProvider = (
  initialOAuthToken?: OAuthToken,
  oAuthTokenProvider?: (token: OAuthToken | undefined) => Promise<OAuthToken>,
  oAuthOnTokenUpdate?: (token: OAuthToken) => void,
  oAuthConfiguration?: OAuthConfiguration
): AuthenticatorInterface<boolean> => {
  // This token is shared between all API calls for a client instance.
  let lastOAuthToken: Promise<OAuthToken | undefined> = Promise.resolve(
    initialOAuthToken
  );

  return (requiresAuth?: boolean) => {
    if (!requiresAuth) {
      return passThroughInterceptor;
    }

    return async (request, options, next) => {
      let oAuthToken = await lastOAuthToken;
      if (
        oAuthTokenProvider &&
        (!isValid(oAuthToken) ||
          isExpired(oAuthToken, oAuthConfiguration?.clockSkew))
      ) {
        // Set the shared token for the next API calls to use.
        lastOAuthToken = oAuthTokenProvider(oAuthToken);
        oAuthToken = await lastOAuthToken;
        if (oAuthOnTokenUpdate && oAuthToken) {
          oAuthOnTokenUpdate(oAuthToken);
        }
      }
      setOAuthTokenInRequest(
        oAuthToken,
        request,
        oAuthConfiguration?.clockSkew
      );
      return next(request, options);
    };
  };
};

function setOAuthTokenInRequest(
  oAuthToken: OAuthToken | undefined,
  request: any,
  clockSkew?: number
) {
  validateAuthorization(oAuthToken, clockSkew);
  request.headers = request.headers ?? {};
  setHeader(
    request.headers,
    AUTHORIZATION_HEADER,
    `Bearer ${oAuthToken?.accessToken}`
  );
}

function validateAuthorization(oAuthToken?: OAuthToken, clockSkew?: number) {
  if (!isValid(oAuthToken)) {
    throw new Error(
      'Client is not authorized. An OAuth token is needed to make API calls.'
    );
  }

  if (isExpired(oAuthToken, clockSkew)) {
    throw new Error(
      'OAuth token is expired. A valid token is needed to make API calls.'
    );
  }
}

export function isValid(
  oAuthToken: OAuthToken | undefined
): oAuthToken is OAuthToken {
  return typeof oAuthToken !== 'undefined';
}

export function isExpired(oAuthToken: OAuthToken, clockSkew?: number) {
  if (typeof oAuthToken.expiry === 'undefined') {
    return false; // Expiry is undefined, token cannot be expired
  }

  let tokenExpiry = oAuthToken.expiry;

  // Adjust expiration time if clockSkew is provided and is not undefined
  if (clockSkew && typeof clockSkew !== 'undefined') {
    tokenExpiry -= BigInt(clockSkew); // Subtract clockSkew from expiry
  }

  return tokenExpiry < Date.now() / 1000;
}
