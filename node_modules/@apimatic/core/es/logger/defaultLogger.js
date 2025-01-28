/**
 * Represents a logger implementation that logs messages to the console.
 */
var ConsoleLogger =
/*#__PURE__*/
/** @class */
function () {
  function ConsoleLogger() {}
  /**
   * Logs a message to the console with the specified log level.
   * @param level The log level of the message.
   * @param message The message to log.
   * @param params Additional parameters to include in the log message.
   */
  ConsoleLogger.prototype.log = function (level, message, params) {
    var formattedMessage = formatMessage(message, params);
    // tslint:disable-next-line:no-console
    console.log(level + ': ' + formattedMessage);
  };
  return ConsoleLogger;
}();
/**
 * Formats a message string by replacing placeholders with corresponding values from an object.
 * @param msg The message string containing placeholders.
 * @param obj The object containing values to replace placeholders.
 * @returns The formatted message string.
 */
function formatMessage(msg, obj) {
  // Use a regular expression to match placeholders in the message string
  var regex = /\${([^}]+)}/g;
  var formattedMsg = msg.replace(regex, function (match, key) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    }
    return match;
  });
  return formattedMsg;
}
export { ConsoleLogger };