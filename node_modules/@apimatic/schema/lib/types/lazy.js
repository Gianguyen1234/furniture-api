"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazy = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
/**
 * Create a schema that lazily delegates to the given schema.
 */
function lazy(schemaFn) {
    var getSchema = (0, utils_1.once)(schemaFn); // Memoize schema
    return {
        type: function () { return "Lazy<".concat(getSchema().type(), ">"); },
        map: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).map.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        unmap: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).unmap.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        validateBeforeMap: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).validateBeforeMap.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        validateBeforeUnmap: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).validateBeforeUnmap.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        mapXml: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).mapXml.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        unmapXml: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).unmapXml.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
        validateBeforeMapXml: function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = getSchema()).validateBeforeMapXml.apply(_a, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        },
    };
}
exports.lazy = lazy;
