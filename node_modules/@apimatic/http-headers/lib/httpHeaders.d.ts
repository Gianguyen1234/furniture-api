/**
 * Set a header in the headers map.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 * @param value Header value
 */
export declare function setHeader(headers: Record<string, string>, name: string, value?: string): void;
/**
 * Set a header in the headers map if it is not already set.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 * @param value Header value
 */
export declare function setHeaderIfNotSet(headers: Record<string, string>, name: string, value?: string): void;
/**
 * Get header from a map of headers.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 */
export declare function getHeader(headers: Record<string, string>, name: string): string | null;
/**
 * Looks up and returns the matching property name from the object.
 *
 * This method returns the matching property name in the object which might or might
 * not have the same case as the prop argument.
 *
 * @param obj Object with string property names
 * @param prop Property to lookup
 */
export declare function lookupCaseInsensitive(obj: Record<string, unknown>, prop: string): string | null;
/**
 * Merge headers
 *
 * Header names are compared using case-insensitive comparison. This method
 * preserves the original header name. If the headersToMerge overrides an existing
 * header, then the new header name (with its casing) is used.
 *
 * @param headers Headers to merge into
 * @param headersToMerge Headers to set
 */
export declare function mergeHeaders(headers: Record<string, string>, headersToMerge: Record<string, string>): void;
/**
 * Assert headers object is valid
 */
export declare function assertHeaders(headers: unknown): asserts headers is Record<string, string>;
/**
 * Return true if header name is valid
 * @param headerName Header name
 */
export declare function isValidHeaderName(headerName: string): boolean;
export declare const CONTENT_TYPE_HEADER = "content-type";
export declare const ACCEPT_HEADER = "accept";
export declare const CONTENT_LENGTH_HEADER = "content-length";
export declare const AUTHORIZATION_HEADER = "authorization";
export declare const FORM_URLENCODED_CONTENT_TYPE = "application/x-www-form-urlencoded";
export declare const JSON_CONTENT_TYPE = "application/json";
export declare const TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";
export declare const XML_CONTENT_TYPE = "application/xml";
//# sourceMappingURL=httpHeaders.d.ts.map