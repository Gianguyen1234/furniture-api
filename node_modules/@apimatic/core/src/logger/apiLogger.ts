import {
  HttpRequest,
  HttpResponse,
  ApiLoggerInterface,
  LoggerInterface,
  LoggingOptions,
  HttpRequestLoggingOptions,
  HttpMessageLoggingOptions,
  LogLevel,
} from '../coreInterfaces';
import {
  CONTENT_LENGTH_HEADER,
  CONTENT_TYPE_HEADER,
  getHeader,
  setHeader,
} from '../http/httpHeaders';

/**
 * Represents a logger implementation for API logging.
 * This logger provides methods to log HTTP requests and responses.
 */
export class ApiLogger implements ApiLoggerInterface {
  private readonly _loggingOptions: LoggingOptions;
  private readonly _logger: LoggerInterface;

  /**
   * Constructs a new instance of ApiLogger.
   * @param loggingOpt The logging options for configuring the logger behavior.
   */
  constructor(loggingOpt: LoggingOptions) {
    this._loggingOptions = loggingOpt;
    this._logger = loggingOpt.logger;
  }

  /**
   * Logs an HTTP request.
   * @param request The HTTP request to log.
   */
  public logRequest(request: HttpRequest): void {
    const logLevel = this._loggingOptions.logLevel;
    const contentTypeHeader = this._getContentType(request.headers);
    const url = this._loggingOptions.logRequest.includeQueryInPath
      ? request.url
      : this._removeQueryParams(request.url);

    this._logger.log(logLevel, 'Request ${method} ${url} ${contentType}', {
      method: request.method,
      url,
      contentType: contentTypeHeader,
    });

    this._applyLogRequestOptions(logLevel, request);
  }

  /**
   * Logs an HTTP response.
   * @param response The HTTP response to log.
   */
  public logResponse(response: HttpResponse): void {
    const logLevel = this._loggingOptions.logLevel;
    const contentTypeHeader = this._getContentType(response.headers);
    const contentLengthHeader = this._getContentLength(response.headers);

    this._logger.log(
      logLevel,
      'Response ${statusCode} ${contentLength} ${contentType}',
      {
        statusCode: response.statusCode,
        contentLength: contentLengthHeader,
        contentType: contentTypeHeader,
      }
    );

    this._applyLogResponseOptions(logLevel, response);
  }

  private _applyLogRequestOptions(level: LogLevel, request: HttpRequest) {
    this._applyLogRequestHeaders(
      level,
      request,
      this._loggingOptions.logRequest
    );

    this._applyLogRequestBody(level, request, this._loggingOptions.logRequest);
  }

  private _applyLogRequestHeaders(
    level: LogLevel,
    request: HttpRequest,
    logRequest: HttpRequestLoggingOptions
  ) {
    const {
      logHeaders,
      headersToInclude,
      headersToExclude,
      headersToWhitelist,
    } = logRequest;

    if (logHeaders) {
      const headersToLog = this._extractHeadersToLog(
        headersToInclude,
        headersToExclude,
        headersToWhitelist,
        request.headers
      );

      this._logger.log(level, 'Request headers ${headers}', {
        headers: headersToLog,
      });
    }
  }

  private _applyLogRequestBody(
    level: LogLevel,
    request: HttpRequest,
    logRequest: HttpRequestLoggingOptions
  ) {
    if (logRequest.logBody) {
      this._logger.log(level, 'Request body ${body}', {
        body: request.body,
      });
    }
  }

  private _applyLogResponseOptions(level: LogLevel, response: HttpResponse) {
    this._applyLogResponseHeaders(
      level,
      response,
      this._loggingOptions.logResponse
    );

    this._applyLogResponseBody(
      level,
      response,
      this._loggingOptions.logResponse
    );
  }

  private _applyLogResponseHeaders(
    level: LogLevel,
    response: HttpResponse,
    logResponse: HttpMessageLoggingOptions
  ) {
    const {
      logHeaders,
      headersToInclude,
      headersToExclude,
      headersToWhitelist,
    } = logResponse;

    if (logHeaders) {
      const headersToLog = this._extractHeadersToLog(
        headersToInclude,
        headersToExclude,
        headersToWhitelist,
        response.headers
      );

      this._logger.log(level, 'Response headers ${headers}', {
        headers: headersToLog,
      });
    }
  }

  private _applyLogResponseBody(
    level: LogLevel,
    response: HttpResponse,
    logResponse: HttpMessageLoggingOptions
  ) {
    if (logResponse.logBody) {
      this._logger.log(level, 'Response body ${body}', {
        body: response.body,
      });
    }
  }

  private _getContentType(headers?: Record<string, string>): string {
    return headers ? getHeader(headers, CONTENT_TYPE_HEADER) ?? '' : '';
  }

  private _getContentLength(headers?: Record<string, string>): string {
    return headers ? getHeader(headers, CONTENT_LENGTH_HEADER) ?? '' : '';
  }

  private _removeQueryParams(url: string): string {
    const queryStringIndex: number = url.indexOf('?');
    return queryStringIndex !== -1 ? url.substring(0, queryStringIndex) : url;
  }

  private _extractHeadersToLog(
    headersToInclude: string[],
    headersToExclude: string[],
    headersToWhitelist: string[],
    headers?: Record<string, string>
  ): Record<string, string> {
    let filteredHeaders: Record<string, string> = {};
    if (!headers) {
      return {};
    }

    if (headersToInclude.length > 0) {
      filteredHeaders = this._includeHeadersToLog(
        headers,
        filteredHeaders,
        headersToInclude
      );
    } else if (headersToExclude.length > 0) {
      filteredHeaders = this._excludeHeadersToLog(
        headers,
        filteredHeaders,
        headersToExclude
      );
    } else {
      filteredHeaders = headers;
    }

    return this._maskSenstiveHeaders(filteredHeaders, headersToWhitelist);
  }

  private _includeHeadersToLog(
    headers: Record<string, string>,
    filteredHeaders: Record<string, string>,
    headersToInclude: string[]
  ): Record<string, string> {
    // Filter headers based on the keys specified in headersToInclude
    headersToInclude.forEach((name) => {
      const key = Object.keys(headers).find(
        (headerKey) => headerKey.toLowerCase() === name.toLowerCase()
      );
      const val = getHeader(headers, name);
      if (val !== null && key) {
        filteredHeaders[key] = val;
      }
    });
    return filteredHeaders;
  }

  private _excludeHeadersToLog(
    headers: Record<string, string>,
    filteredHeaders: Record<string, string>,
    headersToExclude: string[]
  ): Record<string, string> {
    // Filter headers based on the keys specified in headersToExclude
    for (const key of Object.keys(headers)) {
      if (
        !headersToExclude.some(
          (excludedName) => excludedName.toLowerCase() === key.toLowerCase()
        )
      ) {
        const value = getHeader(headers, key);
        if (value !== null) {
          filteredHeaders[key] = value;
        }
      }
    }
    return filteredHeaders;
  }

  private _maskSenstiveHeaders(
    headers: Record<string, string>,
    headersToWhitelist: string[]
  ): Record<string, string> {
    if (this._loggingOptions.maskSensitiveHeaders) {
      for (const key of Object.keys(headers)) {
        const val = getHeader(headers, key) ?? '';
        setHeader(
          headers,
          key,
          this._maskIfSenstiveHeader(key, val, headersToWhitelist)
        );
      }
    }
    return headers;
  }

  private _maskIfSenstiveHeader(
    name: string,
    value: string,
    headersToWhiteList: string[]
  ): string {
    const nonSensitiveHeaders: string[] = [
      'accept',
      'accept-charset',
      'accept-encoding',
      'accept-language',
      'access-control-allow-origin',
      'cache-control',
      'connection',
      'content-encoding',
      'content-language',
      'content-length',
      'content-location',
      'content-md5',
      'content-range',
      'content-type',
      'date',
      'etag',
      'expect',
      'expires',
      'from',
      'host',
      'if-match',
      'if-modified-since',
      'if-none-match',
      'if-range',
      'if-unmodified-since',
      'keep-alive',
      'last-modified',
      'location',
      'max-forwards',
      'pragma',
      'range',
      'referer',
      'retry-after',
      'server',
      'trailer',
      'transfer-encoding',
      'upgrade',
      'user-agent',
      'vary',
      'via',
      'warning',
      'x-forwarded-for',
      'x-requested-with',
      'x-powered-by',
    ];

    const lowerCaseHeadersToWhiteList = headersToWhiteList.map((header) =>
      header.toLowerCase()
    );
    return nonSensitiveHeaders.includes(name.toLowerCase()) ||
      lowerCaseHeadersToWhiteList.includes(name.toLowerCase())
      ? value
      : '**Redacted**';
  }
}
