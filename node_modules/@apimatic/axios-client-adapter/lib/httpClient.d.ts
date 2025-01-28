import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { HttpRequest, HttpResponse, RetryConfiguration } from '@apimatic/core-interfaces';
export declare const DEFAULT_AXIOS_CONFIG_OVERRIDES: AxiosRequestConfig;
export declare const DEFAULT_TIMEOUT: number;
/**
 * HTTP client implementation.
 *
 * This implementation is a wrapper over the Axios client.
 */
export declare class HttpClient {
    private _axiosInstance;
    private _timeout;
    private _abortErrorFactory;
    constructor(abortErrorFactory: AbortErrorConstructor, { clientConfigOverrides, timeout, httpAgent, httpsAgent, }?: {
        clientConfigOverrides?: AxiosRequestConfig;
        timeout?: number;
        httpAgent?: any;
        httpsAgent?: any;
    });
    /** Converts an HttpRequest object to an Axios request. */
    convertHttpRequest(req: HttpRequest): AxiosRequestConfig;
    /** Converts an Axios response to an HttpResponse object. */
    convertHttpResponse(resp: AxiosResponse): HttpResponse;
    convertAxiosResponseHeadersToHttpResponseHeaders(axiosHeaders: RawAxiosResponseHeaders | AxiosResponseHeaders): Record<string, string>;
    /**
     * Executes the HttpRequest with the given options and returns the HttpResponse
     * or throws an error.
     */
    executeRequest(request: HttpRequest, requestOptions?: {
        abortSignal?: AbortSignal;
    }): Promise<HttpResponse>;
    private abortError;
}
/** Stable configurable http client options. */
export interface HttpClientOptions {
    /** Timeout in milliseconds. */
    timeout: number;
    /** Custom http agent to be used when performing http requests. */
    httpAgent?: any;
    /** Custom https agent to be used when performing https requests. */
    httpsAgent?: any;
    /** Configurations to retry requests */
    retryConfig: Partial<RetryConfiguration>;
}
export type AbortErrorConstructor = new (message?: string) => any;
/**
 * Check whether value is an instance of Blob
 *
 * @remark
 * Reference: https://github.com/sindresorhus/is-blob/blob/master/index.js
 *
 * @param value Value to check
 * @returns True if the value is a Blob instance
 */
export declare function isBlob(value: unknown): value is Blob;
//# sourceMappingURL=httpClient.d.ts.map