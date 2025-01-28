import { LogLevel, LoggerInterface } from '@apimatic/core-interfaces';

/**
 * Represents partial logging options for configuring logging behavior.
 * All properties are optional.
 */
export interface PartialLoggingOptions {
  /**
   * The logger interface to use for logging.
   */
  logger?: LoggerInterface;

  /**
   * The log level for logging messages.
   */
  logLevel?: LogLevel;

  /**
   * Partial logging options for HTTP request logging.
   */
  logRequest?: PartialHttpRequestLoggingOptions;

  /**
   * Partial logging options for HTTP response logging.
   */
  logResponse?: PartialHttpMessageLoggingOptions;

  /**
   * Indicates whether sensitive headers should be masked in logs.
   */
  maskSensitiveHeaders?: boolean;
}

/**
 * Represents partial logging options for HTTP message logging.
 * All properties are optional.
 */
export interface PartialHttpMessageLoggingOptions {
  /**
   * Indicates whether to log the body of the HTTP message.
   */
  logBody?: boolean;

  /**
   * Indicates whether to log the headers of the HTTP message.
   */
  logHeaders?: boolean;

  /**
   * Array of headers not to be displayed in logging.
   */
  headersToExclude?: string[];

  /**
   * Array of headers to be displayed in logging.
   */
  headersToInclude?: string[];

  /**
   * Array of headers which values are non-senstive to display in logging.
   */
  headersToWhitelist?: string[];
}

/**
 * Represents partial logging options for HTTP request logging.
 * Extends PartialHttpMessageLoggingOptions.
 * All properties are optional.
 */
export interface PartialHttpRequestLoggingOptions
  extends PartialHttpMessageLoggingOptions {
  /**
   * Indicates whether to include query parameters in the request URL when logging.
   */
  includeQueryInPath?: boolean;
}
