import { HttpResponse } from '@apimatic/core-interfaces';
/**
 * Validates the protocol and removes duplicate forward slashes
 *
 * @param url URL to clean
 * @returns Sanitized URL
 */
export declare function sanitizeUrl(url: string): string;
/**
 * Create warning for deprecated method usage.
 *
 * This is called once per deprecated method. If this method is called again
 * with the same arguments, no warning is generated.
 *
 * @param methodName Method name for deprecated method
 * @param notice Optional message for deprecation
 */
export declare function deprecated(methodName: string, notice?: string): void;
/**
 * Replace the templated placeholders in user-agent with the platform
 * related information.
 * @param userAgent User-agent value to be updated
 * @returns Updated user-agent value
 */
export declare function updateUserAgent(userAgent: string, apiVersion?: string, detail?: string): string;
/**
 * Replace the templated placeholders in error with the platform
 * related information.
 * @param message message value to be updated
 * @returns Updated message value
 */
export declare function updateErrorMessage(message: string, response: HttpResponse): string;
//# sourceMappingURL=apiHelper.d.ts.map