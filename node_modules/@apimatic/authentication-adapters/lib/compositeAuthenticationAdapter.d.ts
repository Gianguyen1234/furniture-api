import { AuthenticatorInterface } from '@apimatic/core-interfaces';
/**
 * Composite auth provider configuration
 */
export type CompositeAuthProviderConfig<T extends string> = Partial<Record<T, AuthenticatorInterface<any>>>;
/**
 * Security requirements defined by an endpoint
 */
export type CompositeAuthSecurityRequirements<T extends string, D extends CompositeAuthProviderConfig<T>> = Array<Partial<{
    [P in T]: D[P] extends undefined | AuthenticatorInterface<infer X> ? X : never;
}>>;
/**
 * Auth param type for composite auth.
 */
export type CompositeAuthParams<T extends string, D extends CompositeAuthProviderConfig<T>> = CompositeAuthSecurityRequirements<T, D> | false;
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
export declare function compositeAuthenticationProvider<T extends string, D extends CompositeAuthProviderConfig<T>>(providerConfig: CompositeAuthProviderConfig<T>): AuthenticatorInterface<CompositeAuthParams<T, D>>;
//# sourceMappingURL=compositeAuthenticationAdapter.d.ts.map