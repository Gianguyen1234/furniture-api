import { HttpMethod, RetryConfiguration } from '../coreInterfaces';
/**
 * An enum to override retries for any endpoint.
 */
export declare enum RequestRetryOption {
    Enable = 0,
    Disable = 1,
    Default = 2
}
/**
 * Returns wait time for the request
 * @param retryConfig Configuration for retry
 * @param method HttpMethod of the request
 * @param allowedWaitTime Remaining allowed wait time
 * @param retryCount Retry attempt number
 * @param httpCode Status code received
 * @param headers Response headers
 * @param timeoutError Error from the server
 * @returns Wait time before the retry
 */
export declare function getRetryWaitTime(retryConfig: RetryConfiguration, allowedWaitTime: number, retryCount: number, httpCode?: number, headers?: Record<string, string>, timeoutError?: Error): number;
export declare function shouldRetryRequest(retryOption: RequestRetryOption, retryConfig?: RetryConfiguration, httpMethod?: HttpMethod): boolean;
//# sourceMappingURL=retryConfiguration.d.ts.map