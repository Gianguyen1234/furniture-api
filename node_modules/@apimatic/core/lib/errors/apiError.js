"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
var tslib_1 = require("tslib");
var json_bigint_1 = tslib_1.__importDefault(require("@apimatic/json-bigint"));
/**
 * Thrown when the HTTP status code is not okay.
 *
 * The ApiError extends the ApiResponse interface, so all ApiResponse
 * properties are available.
 */
var ApiError = /** @class */ (function (_super) {
    tslib_1.__extends(ApiError, _super);
    function ApiError(context, message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        var request = context.request, response = context.response;
        _this.request = request;
        _this.statusCode = response.statusCode;
        _this.headers = response.headers;
        _this.body = response.body;
        if (typeof response.body === 'string' && response.body !== '') {
            var JSON_1 = (0, json_bigint_1.default)();
            try {
                _this.result = JSON_1.parse(response.body);
            }
            catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    if (console) {
                        // tslint:disable-next-line:no-console
                        console.warn("Unexpected error: Could not parse HTTP response body as JSON. ".concat(error.message));
                    }
                }
            }
        }
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
