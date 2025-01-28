import { HttpRequest, HttpResponse, ApiLoggerInterface, LoggingOptions } from '../coreInterfaces';
/**
 * Represents a logger implementation for API logging.
 * This logger provides methods to log HTTP requests and responses.
 */
export declare class ApiLogger implements ApiLoggerInterface {
    private readonly _loggingOptions;
    private readonly _logger;
    /**
     * Constructs a new instance of ApiLogger.
     * @param loggingOpt The logging options for configuring the logger behavior.
     */
    constructor(loggingOpt: LoggingOptions);
    /**
     * Logs an HTTP request.
     * @param request The HTTP request to log.
     */
    logRequest(request: HttpRequest): void;
    /**
     * Logs an HTTP response.
     * @param response The HTTP response to log.
     */
    logResponse(response: HttpResponse): void;
    private _applyLogRequestOptions;
    private _applyLogRequestHeaders;
    private _applyLogRequestBody;
    private _applyLogResponseOptions;
    private _applyLogResponseHeaders;
    private _applyLogResponseBody;
    private _getContentType;
    private _getContentLength;
    private _removeQueryParams;
    private _extractHeadersToLog;
    private _includeHeadersToLog;
    private _excludeHeadersToLog;
    private _maskSenstiveHeaders;
    private _maskIfSenstiveHeader;
}
//# sourceMappingURL=apiLogger.d.ts.map