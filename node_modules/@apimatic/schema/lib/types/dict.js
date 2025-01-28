"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dict = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
/**
 * Create a dictionary schema.
 *
 * This can be used to map/unmap a type like Record<string, something>.
 */
function dict(itemSchema) {
    var validate = function (validateFn, value, ctxt) {
        if (typeof value !== 'object' || value === null) {
            return ctxt.fail();
        }
        var valueObject = value;
        return ctxt.flatmapChildren((0, utils_1.objectEntries)(valueObject), itemSchema, function (v, childCtxt) { return itemSchema[validateFn](v[1], childCtxt); });
    };
    return {
        type: function () { return "Record<string,".concat(itemSchema.type(), ">"); },
        validateBeforeMap: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return validate.apply(void 0, tslib_1.__spreadArray(['validateBeforeMap'], tslib_1.__read(args), false));
        },
        validateBeforeUnmap: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return validate.apply(void 0, tslib_1.__spreadArray(['validateBeforeUnmap'], tslib_1.__read(args), false));
        },
        map: function (value, ctxt) {
            var output = {};
            for (var key in value) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    var propValue = value[key];
                    output[key] = itemSchema.map(propValue, ctxt.createChild(key, propValue, itemSchema));
                }
            }
            return output;
        },
        unmap: function (value, ctxt) {
            var output = {};
            for (var key in value) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    var propValue = value[key];
                    output[key] = itemSchema.unmap(propValue, ctxt.createChild(key, propValue, itemSchema));
                }
            }
            return output;
        },
        validateBeforeMapXml: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return validate.apply(void 0, tslib_1.__spreadArray(['validateBeforeMapXml'], tslib_1.__read(args), false));
        },
        mapXml: function (value, ctxt) {
            var output = {};
            for (var key in value) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    var propValue = value[key];
                    output[key] = itemSchema.mapXml(propValue, ctxt.createChild(key, propValue, itemSchema));
                }
            }
            return output;
        },
        unmapXml: function (value, ctxt) {
            var output = {};
            for (var key in value) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    var propValue = value[key];
                    output[key] = itemSchema.unmapXml(propValue, ctxt.createChild(key, propValue, itemSchema));
                }
            }
            return output;
        },
    };
}
exports.dict = dict;
