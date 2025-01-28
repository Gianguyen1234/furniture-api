"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compositeAuthenticationProvider = void 0;
var tslib_1 = require("tslib");
var core_interfaces_1 = require("@apimatic/core-interfaces");
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
function compositeAuthenticationProvider(providerConfig) {
    return function (securityRequirements) {
        // If auth param is false or an empty list, skip authentication.
        if (!securityRequirements || securityRequirements.length === 0) {
            return core_interfaces_1.passThroughInterceptor;
        }
        // Find an auth combination in the list of optional combinations that can be
        // applied given the current auth configuration.
        var matchingAuthCombination = findMatchingAuth(securityRequirements, providerConfig);
        // If no auth combination satisfies the security requirements, raise an
        // error.
        if (!matchingAuthCombination) {
            throw new Error('Required authentication credentials for this API call are not provided or all provided auth combinations are disabled');
        }
        // Get interceptors for the selected auth combination.
        var authInterceptors = getHttpInterceptorsForAuths(matchingAuthCombination, providerConfig);
        return (0, core_interfaces_1.combineHttpInterceptors)(authInterceptors);
    };
}
exports.compositeAuthenticationProvider = compositeAuthenticationProvider;
/**
 * Finds the matching AND combination inside the security requirements list that
 * can be applied given the current provider config.
 */
function findMatchingAuth(securityRequirements, providerConfig) {
    return securityRequirements.find(function (andRequirements) {
        return Object.keys(andRequirements).every(function (key) { return key in providerConfig && providerConfig[key]; }) && Object.values(andRequirements).every(function (value) { return value; });
    });
}
/**
 * Get HTTP interceptor instances from each auth provider
 */
function getHttpInterceptorsForAuths(matchingRequirements, providerConfig) {
    return Object.entries(matchingRequirements).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), authProvider = _b[0], authParam = _b[1];
        if (providerConfig[authProvider] !== undefined) {
            return providerConfig[authProvider](authParam);
        }
        else {
            return core_interfaces_1.passThroughInterceptor;
        }
    });
}
