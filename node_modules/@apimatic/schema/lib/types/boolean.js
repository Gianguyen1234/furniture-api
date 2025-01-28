"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boolean = void 0;
var utils_1 = require("../utils");
function isValidBooleanValue(value, strict) {
    return strict
        ? typeof value === 'boolean'
        : typeof value === 'boolean' ||
            (typeof value === 'string' && (value === 'true' || value === 'false'));
}
/** Create a boolean schema. */
function boolean() {
    return (0, utils_1.createSymmetricSchema)({
        type: 'boolean',
        validate: (0, utils_1.toValidator)(isValidBooleanValue),
        map: function (value) { return (typeof value === 'boolean' ? value : value === 'true'); },
    });
}
exports.boolean = boolean;
