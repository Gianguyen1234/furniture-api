import { __extends } from 'tslib';

/**
 * Thrown when the API call is aborted by the caller.
 *
 * Note that when an AbortError is thrown, it is not a guarantee that the API call
 * did not go through.
 */
var AbortError =
/*#__PURE__*/
/** @class */
function (_super) {
  __extends(AbortError, _super);
  function AbortError(message) {
    var _newTarget = this.constructor;
    var _this = _super.call(this, message) || this;
    Object.setPrototypeOf(_this, _newTarget.prototype);
    return _this;
  }
  return AbortError;
}(Error);
export { AbortError };