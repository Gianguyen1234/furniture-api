import { HttpRequest } from './httpRequest';
import { HttpResponse } from './httpResponse';
/**
 * Represents an interface for logging API requests and responses.
 */
export interface ApiLoggerInterface {
  /**
   * Logs the details of an HTTP request.
   * @param request The HTTP request to log.
   */
  logRequest(request: HttpRequest): void;

  /**
   * Logs the details of an HTTP response.
   * @param response The HTTP response to log.
   */
  logResponse(response: HttpResponse): void;
}

/**
 * Represents an interface for a generic logger.
 */
export interface LoggerInterface {
  /**
   * Logs a message with a specified log level and additional parameters.
   * @param level The log level of the message.
   * @param message The message to log.
   * @param params Additional parameters to include in the log message.
   */
  log(level: LogLevel, message: string, params: Record<string, any>): void;
}

/**
 * Represents options for configuring logging behavior.
 */
export interface LoggingOptions {
  /**
   * The logger to use for logging messages.
   */
  logger: LoggerInterface;

  /**
   * The log level to determine which messages should be logged.
   */
  logLevel: LogLevel;

  /**
   * Options for logging HTTP requests.
   */
  logRequest: HttpRequestLoggingOptions;

  /**
   * Options for logging HTTP responses.
   */
  logResponse: HttpMessageLoggingOptions;

  /**
   * Indicates whether sensitive headers should be masked in logged messages.
   */
  maskSensitiveHeaders: boolean;
}

/**
 * Represents options for logging HTTP message details.
 */
export interface HttpMessageLoggingOptions {
  /**
   * Indicates whether the message body should be logged.
   */
  logBody: boolean;

  /**
   * Indicates whether the message headers should be logged.
   */
  logHeaders: boolean;

  /**
   * Array of headers not to be displayed in logging.
   */
  headersToExclude: string[];

  /**
   * Array of headers to be displayed in logging.
   */
  headersToInclude: string[];

  /**
   * Array of headers which values are non-senstive to display in logging.
   */
  headersToWhitelist: string[];
}

/**
 * Represents options for logging HTTP request details.
 */
export interface HttpRequestLoggingOptions extends HttpMessageLoggingOptions {
  /**
   * Indicates whether the request query parameters should be included in the logged URL.
   */
  includeQueryInPath: boolean;
}

/**
 * Enum representing different log levels.
 */
export enum LogLevel {
  /**
   * Error log level.
   */
  Error = 'error',

  /**
   * Warning log level.
   */
  Warn = 'warn',

  /**
   * Information log level.
   */
  Info = 'info',

  /**
   * Debug log level.
   */
  Debug = 'debug',

  /**
   * Trace log level.
   */
  Trace = 'trace',
}
