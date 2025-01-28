"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthenticationProvider = void 0;
var core_interfaces_1 = require("@apimatic/core-interfaces");
var basicAuthenticationProvider = function (basicAuthUserName, basicAuthPassword) {
    return function (requiresAuth) {
        if (!requiresAuth) {
            return core_interfaces_1.passThroughInterceptor;
        }
        return function (request, options, next) {
            request.auth = {
                username: basicAuthUserName,
                password: basicAuthPassword,
            };
            return next(request, options);
        };
    };
};
exports.basicAuthenticationProvider = basicAuthenticationProvider;
