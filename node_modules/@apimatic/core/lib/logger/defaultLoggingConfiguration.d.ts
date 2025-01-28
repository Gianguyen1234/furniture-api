import { LoggingOptions } from '@apimatic/core-interfaces';
import { PartialLoggingOptions } from './loggingOptions';
/**
 * Default logging options
 */
export declare const DEFAULT_LOGGING_OPTIONS: LoggingOptions;
/**
 * Create a new logging options object, falling back to the default values when not provided.
 *
 * @param newOptions Options to override
 * @param defaultOptions Defaults options to be used when some values are not provided in the newOptions
 * @returns Merged options object
 */
export declare function mergeLoggingOptions(newOptions: PartialLoggingOptions, defaultOptions?: LoggingOptions): LoggingOptions;
//# sourceMappingURL=defaultLoggingConfiguration.d.ts.map