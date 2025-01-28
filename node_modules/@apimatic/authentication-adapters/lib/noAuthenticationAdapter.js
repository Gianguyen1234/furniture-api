"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noneAuthenticationProvider = void 0;
var core_interfaces_1 = require("@apimatic/core-interfaces");
/** None authentication provider */
var noneAuthenticationProvider = function () { return core_interfaces_1.passThroughInterceptor; };
exports.noneAuthenticationProvider = noneAuthenticationProvider;
