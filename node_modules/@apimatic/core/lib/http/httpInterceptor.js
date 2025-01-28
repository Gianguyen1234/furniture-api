"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHttpInterceptors = void 0;
var core_interfaces_1 = require("@apimatic/core-interfaces");
/**
 * Calls HTTP interceptor chain
 *
 * @param interceptors HTTP interceptor chain
 * @param client Terminating HTTP handler
 */
function callHttpInterceptors(interceptors, client) {
    return function (request, options) {
        return (0, core_interfaces_1.combineHttpInterceptors)(interceptors)(request, options, client);
    };
}
exports.callHttpInterceptors = callHttpInterceptors;
