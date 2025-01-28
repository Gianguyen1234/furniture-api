"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
/**
 * Enum representing different log levels.
 */
var LogLevel;
(function (LogLevel) {
    /**
     * Error log level.
     */
    LogLevel["Error"] = "error";
    /**
     * Warning log level.
     */
    LogLevel["Warn"] = "warn";
    /**
     * Information log level.
     */
    LogLevel["Info"] = "info";
    /**
     * Debug log level.
     */
    LogLevel["Debug"] = "debug";
    /**
     * Trace log level.
     */
    LogLevel["Trace"] = "trace";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
