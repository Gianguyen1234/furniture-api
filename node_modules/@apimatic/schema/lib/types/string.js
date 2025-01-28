"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = void 0;
var utils_1 = require("../utils");
function isValidStringValue(value) {
    return typeof value === 'string';
}
/** Create a string schema. */
function string() {
    return (0, utils_1.createSymmetricSchema)({
        type: 'string',
        validate: (0, utils_1.toValidator)(isValidStringValue),
        map: utils_1.identityFn,
    });
}
exports.string = string;
