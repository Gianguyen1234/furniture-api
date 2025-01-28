import { LogLevel } from '@apimatic/core-interfaces';
import { ConsoleLogger } from './defaultLogger.js';
import defaultsDeep from 'lodash.defaultsdeep';

/**
 * Default logging options
 */
var DEFAULT_LOGGING_OPTIONS = {
  logger: /*#__PURE__*/new ConsoleLogger(),
  logLevel: LogLevel.Info,
  logRequest: {
    includeQueryInPath: false,
    logBody: false,
    logHeaders: false,
    headersToExclude: [],
    headersToInclude: [],
    headersToWhitelist: []
  },
  logResponse: {
    logBody: false,
    logHeaders: false,
    headersToExclude: [],
    headersToInclude: [],
    headersToWhitelist: []
  },
  maskSensitiveHeaders: true
};
/**
 * Create a new logging options object, falling back to the default values when not provided.
 *
 * @param newOptions Options to override
 * @param defaultOptions Defaults options to be used when some values are not provided in the newOptions
 * @returns Merged options object
 */
function mergeLoggingOptions(newOptions, defaultOptions) {
  if (defaultOptions === void 0) {
    defaultOptions = DEFAULT_LOGGING_OPTIONS;
  }
  return defaultsDeep({}, newOptions, defaultOptions);
}
export { DEFAULT_LOGGING_OPTIONS, mergeLoggingOptions };