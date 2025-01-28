/**
 * Represents a logger implementation that does not perform any logging.
 * Messages logged using this logger are effectively ignored.
 */
var NullLogger =
/*#__PURE__*/
/** @class */
function () {
  function NullLogger() {}
  /**
   * Logs a message. Since this is a null logger, the log method does nothing.
   * @param _level The log level (ignored).
   * @param _message The message to log (ignored).
   * @param _params Additional parameters for the log message (ignored).
   */
  NullLogger.prototype.log = function (_level, _message, _params) {
    // This is a null logger, so it does not perform any logging.
    // All parameters are ignored.
    return;
  };
  return NullLogger;
}();
export { NullLogger };