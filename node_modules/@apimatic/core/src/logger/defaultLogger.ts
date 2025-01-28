import { LogLevel, LoggerInterface } from '@apimatic/core-interfaces';

/**
 * Represents a logger implementation that logs messages to the console.
 */
export class ConsoleLogger implements LoggerInterface {
  /**
   * Logs a message to the console with the specified log level.
   * @param level The log level of the message.
   * @param message The message to log.
   * @param params Additional parameters to include in the log message.
   */
  public log(
    level: LogLevel,
    message: string,
    params: Record<string, any>
  ): void {
    const formattedMessage = formatMessage(message, params);
    // tslint:disable-next-line:no-console
    console.log(level + ': ' + formattedMessage);
  }
}

/**
 * Formats a message string by replacing placeholders with corresponding values from an object.
 * @param msg The message string containing placeholders.
 * @param obj The object containing values to replace placeholders.
 * @returns The formatted message string.
 */
function formatMessage(msg: string, obj: Record<string, any>): string {
  // Use a regular expression to match placeholders in the message string
  const regex = /\${([^}]+)}/g;

  const formattedMsg = msg.replace(regex, (match, key) => {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    return match;
  });

  return formattedMsg;
}
