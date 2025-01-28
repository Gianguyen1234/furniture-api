"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optional = void 0;
var utils_1 = require("../utils");
/**
 * Create an optional schema.
 *
 * The optional schema allows 'undefined' or the values allowed by the given
 * 'schema'.
 */
function optional(schema) {
    return {
        type: function () { return "Optional<".concat(schema.type(), ">"); },
        validateBeforeMap: function (value, ctxt) {
            return (0, utils_1.isNullOrMissing)(value) ? [] : schema.validateBeforeMap(value, ctxt);
        },
        validateBeforeUnmap: function (value, ctxt) {
            return typeof value === 'undefined'
                ? []
                : schema.validateBeforeUnmap(value, ctxt);
        },
        map: function (value, ctxt) {
            return (0, utils_1.isNullOrMissing)(value) ? undefined : schema.map(value, ctxt);
        },
        unmap: function (value, ctxt) {
            return typeof value === 'undefined' ? undefined : schema.unmap(value, ctxt);
        },
        validateBeforeMapXml: function (value, ctxt) {
            return typeof value === 'undefined'
                ? []
                : schema.validateBeforeMapXml(value, ctxt);
        },
        mapXml: function (value, ctxt) {
            return typeof value === 'undefined' ? undefined : schema.mapXml(value, ctxt);
        },
        unmapXml: function (value, ctxt) {
            return typeof value === 'undefined' ? undefined : schema.unmapXml(value, ctxt);
        },
    };
}
exports.optional = optional;
