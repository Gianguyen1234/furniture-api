import { __extends } from 'tslib';

/**
 * Thrown when the API response does not match the schema.
 */
var ResponseValidationError =
/*#__PURE__*/
/** @class */
function (_super) {
  __extends(ResponseValidationError, _super);
  function ResponseValidationError(apiResponse, errors) {
    var _newTarget = this.constructor;
    var _this = this;
    var message = 'The response did not match the response schema.';
    if (errors.length === 1) {
      message += "\n\n".concat(errors[0].message);
    } else {
      message += errors.map(function (e, i) {
        return "\n\n> Issue #".concat(i + 1, "\n\n").concat(e.message);
      }).join('');
    }
    _this = _super.call(this, message) || this;
    Object.setPrototypeOf(_this, _newTarget.prototype);
    _this.request = apiResponse.request;
    _this.statusCode = apiResponse.statusCode;
    _this.headers = apiResponse.headers;
    _this.body = apiResponse.body;
    _this.errors = errors;
    return _this;
  }
  return ResponseValidationError;
}(Error);
export { ResponseValidationError };