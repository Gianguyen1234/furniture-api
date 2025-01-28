"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenAuthenticationProvider = void 0;
var core_interfaces_1 = require("@apimatic/core-interfaces");
var http_headers_1 = require("@apimatic/http-headers");
var accessTokenAuthenticationProvider = function (_a) {
    var accessToken = _a.accessToken;
    return function (requiresAuth) {
        if (!requiresAuth) {
            return core_interfaces_1.passThroughInterceptor;
        }
        return function (request, options, next) {
            var _a;
            request.headers = (_a = request.headers) !== null && _a !== void 0 ? _a : {};
            (0, http_headers_1.setHeader)(request.headers, http_headers_1.AUTHORIZATION_HEADER, "Bearer ".concat(accessToken));
            return next(request, options);
        };
    };
};
exports.accessTokenAuthenticationProvider = accessTokenAuthenticationProvider;
