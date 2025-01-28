"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeLoggingOptions = exports.DEFAULT_LOGGING_OPTIONS = void 0;
var tslib_1 = require("tslib");
var core_interfaces_1 = require("@apimatic/core-interfaces");
var defaultLogger_1 = require("./defaultLogger");
var lodash_defaultsdeep_1 = tslib_1.__importDefault(require("lodash.defaultsdeep"));
/**
 * Default logging options
 */
exports.DEFAULT_LOGGING_OPTIONS = {
    logger: new defaultLogger_1.ConsoleLogger(),
    logLevel: core_interfaces_1.LogLevel.Info,
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
function mergeLoggingOptions(newOptions, defaultOptions) {
    if (defaultOptions === void 0) { defaultOptions = exports.DEFAULT_LOGGING_OPTIONS; }
    return (0, lodash_defaultsdeep_1.default)({}, newOptions, defaultOptions);
}
exports.mergeLoggingOptions = mergeLoggingOptions;
