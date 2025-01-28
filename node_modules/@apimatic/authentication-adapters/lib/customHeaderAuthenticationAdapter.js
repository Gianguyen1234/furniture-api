"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customHeaderAuthenticationProvider = void 0;
var core_interfaces_1 = require("@apimatic/core-interfaces");
var http_headers_1 = require("@apimatic/http-headers");
var customHeaderAuthenticationProvider = function (customHeaderParams) {
    return function (requiresAuth) {
        if (!requiresAuth) {
            return core_interfaces_1.passThroughInterceptor;
        }
        return function (request, options, next) {
            var _a;
            request.headers = (_a = request.headers) !== null && _a !== void 0 ? _a : {};
            (0, http_headers_1.mergeHeaders)(request.headers, customHeaderParams);
            return next(request, options);
        };
    };
};
exports.customHeaderAuthenticationProvider = customHeaderAuthenticationProvider;
