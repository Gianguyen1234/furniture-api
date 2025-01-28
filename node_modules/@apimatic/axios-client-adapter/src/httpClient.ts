import {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios';
import axios from 'axios';
import isNode from 'detect-node';
import FormData from 'form-data';
import {
  CONTENT_TYPE_HEADER,
  FORM_URLENCODED_CONTENT_TYPE,
} from '@apimatic/http-headers';
import {
  HttpRequest,
  HttpResponse,
  RetryConfiguration,
} from '@apimatic/core-interfaces';
import { urlEncodeKeyValuePairs } from '@apimatic/http-query';
import { isFileWrapper } from '@apimatic/file-wrapper';

export const DEFAULT_AXIOS_CONFIG_OVERRIDES: AxiosRequestConfig = {
  transformResponse: [],
};

export const DEFAULT_TIMEOUT = 30 * 1000;

/**
 * HTTP client implementation.
 *
 * This implementation is a wrapper over the Axios client.
 */
export class HttpClient {
  private _axiosInstance: AxiosInstance;
  private _timeout: number;
  private _abortErrorFactory: AbortErrorConstructor;

  constructor(
    abortErrorFactory: AbortErrorConstructor,
    {
      clientConfigOverrides,
      timeout = DEFAULT_TIMEOUT,
      httpAgent,
      httpsAgent,
    }: {
      clientConfigOverrides?: AxiosRequestConfig;
      timeout?: number;
      httpAgent?: any;
      httpsAgent?: any;
    } = {}
  ) {
    this._timeout = timeout;
    this._axiosInstance = axios.create({
      ...DEFAULT_AXIOS_CONFIG_OVERRIDES,
      ...clientConfigOverrides,
      ...{ httpAgent, httpsAgent },
    });
    this._abortErrorFactory = abortErrorFactory;
  }

  /** Converts an HttpRequest object to an Axios request. */
  public convertHttpRequest(req: HttpRequest): AxiosRequestConfig {
    const newRequest: AxiosRequestConfig = {
      method: req.method,
      url: req.url,
      responseType: 'text',
      headers: { ...req.headers },
    };

    let headers = new AxiosHeaders({
      ...req.headers,
    });

    if (req.auth) {
      // Set basic auth credentials if provided
      newRequest.auth = {
        username: req.auth.username,
        password: req.auth.password || '',
      };
    }

    const requestBody = req.body;
    if (requestBody?.type === 'text') {
      newRequest.data = requestBody.content;
    } else if (
      requestBody?.type === 'form-data' &&
      requestBody.content.some((item) => isFileWrapper(item.value))
    ) {
      // Create multipart request if a file is present
      const form = new FormData();
      for (const iter of requestBody.content) {
        if (isFileWrapper(iter.value)) {
          let fileData = iter.value.file;

          // Make sure Blob has the correct content type if provided
          if (isBlob(fileData) && iter.value.options?.contentType) {
            fileData = new Blob([fileData], {
              type: iter.value.options.contentType,
            });
          }

          form.append(iter.key, fileData, iter.value.options);
        } else {
          form.append(iter.key, iter.value);
        }
      }

      newRequest.data = form;
      headers = headers.concat(form.getHeaders());
    } else if (
      requestBody?.type === 'form-data' ||
      requestBody?.type === 'form'
    ) {
      // Create form-urlencoded request
      headers = headers.set(CONTENT_TYPE_HEADER, FORM_URLENCODED_CONTENT_TYPE);

      newRequest.data = urlEncodeKeyValuePairs(requestBody.content);
    } else if (requestBody?.type === 'stream') {
      let contentType = 'application/octet-stream';
      if (isBlob(requestBody.content.file) && requestBody.content.file.type) {
        // Set Blob mime type as the content-type header if present
        contentType = requestBody.content.file.type;
      } else if (requestBody.content.options?.contentType) {
        // Otherwise, use the content type if available.
        contentType = requestBody.content.options.contentType;
      }
      headers = headers.set(CONTENT_TYPE_HEADER, contentType, false);
      newRequest.data = requestBody.content.file;
    }

    if (req.responseType === 'stream') {
      newRequest.responseType = isNode ? 'stream' : 'blob';
    }

    // Prevent superagent from converting any status code to error
    newRequest.validateStatus = () => true;

    // Set 30 seconds timeout
    newRequest.timeout = this._timeout;

    // set headers
    newRequest.headers = headers;

    return newRequest;
  }

  /** Converts an Axios response to an HttpResponse object. */
  public convertHttpResponse(resp: AxiosResponse): HttpResponse {
    return {
      body: resp.data,
      headers: this.convertAxiosResponseHeadersToHttpResponseHeaders(
        resp.headers
      ),
      statusCode: resp.status,
    };
  }

  public convertAxiosResponseHeadersToHttpResponseHeaders(
    axiosHeaders: RawAxiosResponseHeaders | AxiosResponseHeaders
  ): Record<string, string> {
    const httpResponseHeaders: Record<string, string> = {};

    // Iterate through each property of AxiosResponseHeaders
    for (const key in axiosHeaders) {
      // Check if the property is not a function (AxiosHeaders may have methods)
      if (typeof axiosHeaders[key] !== 'function') {
        // Convert property key to lowercase as HTTP headers are case-insensitive
        const lowercaseKey = key.toLowerCase();
        // Assign the value to HttpResponse headers
        httpResponseHeaders[lowercaseKey] = String(axiosHeaders[key]);
      }
    }

    return httpResponseHeaders;
  }

  /**
   * Executes the HttpRequest with the given options and returns the HttpResponse
   * or throws an error.
   */
  public async executeRequest(
    request: HttpRequest,
    requestOptions?: { abortSignal?: AbortSignal }
  ): Promise<HttpResponse> {
    const axiosRequest = this.convertHttpRequest(request);

    if (requestOptions?.abortSignal) {
      // throw if already aborted; do not place HTTP call
      if (requestOptions.abortSignal.aborted) {
        throw this.abortError();
      }

      const cancelToken = axios.CancelToken.source();
      axiosRequest.cancelToken = cancelToken.token;

      // attach abort event handler
      requestOptions.abortSignal.addEventListener('abort', () => {
        cancelToken.cancel();
      });
    }

    try {
      return this.convertHttpResponse(await this._axiosInstance(axiosRequest));
    } catch (error) {
      // abort error should be thrown as the AbortError
      if (axios.isCancel(error)) {
        throw this.abortError();
      }

      throw error;
    }
  }

  private abortError() {
    return new this._abortErrorFactory('The HTTP call was aborted.');
  }
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
export function isBlob(value: unknown): value is Blob {
  if (typeof Blob === 'undefined') {
    return false;
  }

  return (
    value instanceof Blob ||
    Object.prototype.toString.call(value) === '[object Blob]'
  );
}
