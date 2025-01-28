import { __extends, __values } from 'tslib';

/**
 * Thrown when one or more arguments passed to a method fail validation.
 */
var ArgumentsValidationError =
/*#__PURE__*/
/** @class */
function (_super) {
  var e_1, _a;
  __extends(ArgumentsValidationError, _super);
  function ArgumentsValidationError(errors) {
    var _newTarget = this.constructor;
    var _this = this;
    var errorKeys = Object.keys(errors);
    var message;
    if (errorKeys.length === 0) {
      message = 'One or more arguments failed validation.';
    } else if (errorKeys.length === 1 && errors[errorKeys[0]].length === 1) {
      message = "Argument for '".concat(errorKeys[0], "' failed validation.\n\n").concat(errors[errorKeys[0]][0].message);
    } else {
      message = "The following arguments failed validation: ".concat(errorKeys.join(', '), ".\n\n");
      var msgList = [];
      try {
        for (var errorKeys_1 = __values(errorKeys), errorKeys_1_1 = errorKeys_1.next(); !errorKeys_1_1.done; errorKeys_1_1 = errorKeys_1.next()) {
          var param = errorKeys_1_1.value;
          msgList.push("> For argument '".concat(param, "':"));
          if (errors[param].length === 1) {
            msgList.push(errors[param][0].message);
          } else {
            for (var index = 0; index < errors[param].length; index++) {
              var error = errors[param][index];
              msgList.push(">> Issue #".concat(index + 1, "\n\n").concat(error.message));
            }
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (errorKeys_1_1 && !errorKeys_1_1.done && (_a = errorKeys_1.return)) _a.call(errorKeys_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      message += msgList.join('\n\n');
    }
    _this = _super.call(this, message) || this;
    Object.setPrototypeOf(_this, _newTarget.prototype);
    _this.errors = errors;
    return _this;
  }
  return ArgumentsValidationError;
}(Error);
export { ArgumentsValidationError };