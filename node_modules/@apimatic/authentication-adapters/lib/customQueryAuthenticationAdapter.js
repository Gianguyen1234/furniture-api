"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customQueryAuthenticationProvider = void 0;
var tslib_1 = require("tslib");
var core_interfaces_1 = require("@apimatic/core-interfaces");
var customQueryAuthenticationProvider = function (customQueryParams) {
    return function (requiresAuth) {
        if (!requiresAuth) {
            return core_interfaces_1.passThroughInterceptor;
        }
        return function (request, options, next) {
            request.url +=
                (request.url.indexOf('?') === -1 ? '?' : '&') +
                    encodeQueryParams(customQueryParams);
            return next(request, options);
        };
    };
};
exports.customQueryAuthenticationProvider = customQueryAuthenticationProvider;
function encodeQueryParams(queryParams) {
    var e_1, _a;
    var queryString = [];
    try {
        for (var _b = tslib_1.__values(Object.keys(queryParams)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            queryString.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(queryParams[key])));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return queryString.join('&');
}
