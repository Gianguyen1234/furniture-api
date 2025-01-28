import {
  AuthenticatorInterface,
  HttpInterceptorInterface,
  RequestOptions,
  combineHttpInterceptors,
  passThroughInterceptor,
} from '@apimatic/core-interfaces';

/**
 * Composite auth provider configuration
 */
export type CompositeAuthProviderConfig<T extends string> = Partial<
  Record<
    T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AuthenticatorInterface<any>
  >
>;

/**
 * Security requirements defined by an endpoint
 */
export type CompositeAuthSecurityRequirements<
  T extends string,
  D extends CompositeAuthProviderConfig<T>
> = Array<
  Partial<
    {
      [P in T]: D[P] extends undefined | AuthenticatorInterface<infer X>
        ? X
        : never;
    }
  >
>;

/**
 * Auth param type for composite auth.
 */
export type CompositeAuthParams<
  T extends string,
  D extends CompositeAuthProviderConfig<T>
> = CompositeAuthSecurityRequirements<T, D> | false;

/**
 * Create a Composite Authentication provider instance using the given configuration.
 *
 * "Composite Authentication Provider" provides authentication by combining one
 * or more existing auth schemes. Auths can be combined by AND clause. Multiple
 * AND clauses can be combined using OR clause.
 *
 * The compositeAuthProvider instance is created by passing it a map of all the
 * available authProvider instances. This map is called the
 * CompositeAuthProviderConfig. For example:
 *
 * ```ts
 * const compositeAuthProviderConfig = {
 *   basicAuth: basicAuthenticationProvider(...),
 *   accessToken: accessTokenAuthenticationProvider(...)
 * };
 *
 * const myAuthProvider = compositeAuthProvider(compositeAuthProviderConfig);
 * ```
 *
 * The compositeAuthProvider instance returned adhere to the
 * AuthenticatorInterface<Params>. This allows it to be used with the
 * RequestBuilder to authenticate endpoint calls. Endpoints can apply the auth
 * by passing their "Security Requirements" to the authenticate method like
 * this:
 *
 * ```ts
 *  const req = this.createRequest('GET', '/auth/basic');
 *  req.authenticate([{ basicAuth: true }, { accessToken: true }]);
 *  return req.callAsText(requestOptions);
 * ```
 *
 * Here, `authenticate()` method accepts a type of "Array of Map". The array
 * denotes auths combined by OR and the map denotes auths combined by AND. This
 * is similar to how Security Requirements are defined in OpenAPI definitions.
 *
 * If the compositeAuthProviderConfig does not satisfy the security requirements
 * defined by the endpoint, then an exception is thrown.
 */
export function compositeAuthenticationProvider<
  T extends string,
  D extends CompositeAuthProviderConfig<T>
>(
  providerConfig: CompositeAuthProviderConfig<T>
): AuthenticatorInterface<CompositeAuthParams<T, D>> {
  return (securityRequirements) => {
    // If auth param is false or an empty list, skip authentication.
    if (!securityRequirements || securityRequirements.length === 0) {
      return passThroughInterceptor;
    }

    // Find an auth combination in the list of optional combinations that can be
    // applied given the current auth configuration.
    const matchingAuthCombination = findMatchingAuth(
      securityRequirements,
      providerConfig
    );

    // If no auth combination satisfies the security requirements, raise an
    // error.
    if (!matchingAuthCombination) {
      throw new Error(
        'Required authentication credentials for this API call are not provided or all provided auth combinations are disabled'
      );
    }

    // Get interceptors for the selected auth combination.
    const authInterceptors = getHttpInterceptorsForAuths(
      matchingAuthCombination,
      providerConfig
    );

    return combineHttpInterceptors(authInterceptors);
  };
}

/**
 * Finds the matching AND combination inside the security requirements list that
 * can be applied given the current provider config.
 */
function findMatchingAuth<T extends string>(
  securityRequirements: CompositeAuthSecurityRequirements<
    T,
    CompositeAuthProviderConfig<T>
  >,
  providerConfig: CompositeAuthProviderConfig<T>
) {
  return securityRequirements.find(
    (andRequirements) =>
      Object.keys(andRequirements).every(
        (key) => key in providerConfig && providerConfig[key]
      ) && Object.values(andRequirements).every((value) => value)
  );
}

/**
 * Get HTTP interceptor instances from each auth provider
 */
function getHttpInterceptorsForAuths<T extends string>(
  matchingRequirements: Partial<Record<T, unknown>>,
  providerConfig: CompositeAuthProviderConfig<T>
): Array<HttpInterceptorInterface<RequestOptions | undefined>> {
  return Object.entries(matchingRequirements).map(
    ([authProvider, authParam]) => {
      if (providerConfig[authProvider] !== undefined) {
        return providerConfig[authProvider](authParam);
      } else {
        return passThroughInterceptor;
      }
    }
  );
}
