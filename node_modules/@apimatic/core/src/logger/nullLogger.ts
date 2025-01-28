import { LoggerInterface, LogLevel } from '../coreInterfaces';

/**
 * Represents a logger implementation that does not perform any logging.
 * Messages logged using this logger are effectively ignored.
 */
export class NullLogger implements LoggerInterface {
  /**
   * Logs a message. Since this is a null logger, the log method does nothing.
   * @param _level The log level (ignored).
   * @param _message The message to log (ignored).
   * @param _params Additional parameters for the log message (ignored).
   */
  public log(
    _level: LogLevel,
    _message: string,
    _params: Record<string, any>
  ): void {
    // This is a null logger, so it does not perform any logging.
    // All parameters are ignored.
    return;
  }
}
