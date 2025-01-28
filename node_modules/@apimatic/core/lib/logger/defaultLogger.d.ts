import { LogLevel, LoggerInterface } from '@apimatic/core-interfaces';
/**
 * Represents a logger implementation that logs messages to the console.
 */
export declare class ConsoleLogger implements LoggerInterface {
    /**
     * Logs a message to the console with the specified log level.
     * @param level The log level of the message.
     * @param message The message to log.
     * @param params Additional parameters to include in the log message.
     */
    log(level: LogLevel, message: string, params: Record<string, any>): void;
}
//# sourceMappingURL=defaultLogger.d.ts.map