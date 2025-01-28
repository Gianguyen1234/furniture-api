import { LogLevel, LoggingOptions } from '@apimatic/core-interfaces';
import { ConsoleLogger } from './defaultLogger';
import defaultsDeep from 'lodash.defaultsdeep';
import { PartialLoggingOptions } from './loggingOptions';

/**
 * Default logging options
 */
export const DEFAULT_LOGGING_OPTIONS: LoggingOptions = {
  logger: new ConsoleLogger(),
  logLevel: LogLevel.Info,
  logRequest: {
    includeQueryInPath: false,
    logBody: false,
    logHeaders: false,
    headersToExclude: [],
    headersToInclude: [],
    headersToWhitelist: [],
  },
  logResponse: {
    logBody: false,
    logHeaders: false,
    headersToExclude: [],
    headersToInclude: [],
    headersToWhitelist: [],
  },
  maskSensitiveHeaders: true,
};

/**
 * Create a new logging options object, falling back to the default values when not provided.
 *
 * @param newOptions Options to override
 * @param defaultOptions Defaults options to be used when some values are not provided in the newOptions
 * @returns Merged options object
 */
export function mergeLoggingOptions(
  newOptions: PartialLoggingOptions,
  defaultOptions: LoggingOptions = DEFAULT_LOGGING_OPTIONS
): LoggingOptions {
  return defaultsDeep({}, newOptions, defaultOptions);
}
