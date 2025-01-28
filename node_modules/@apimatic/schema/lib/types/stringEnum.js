"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEnum = void 0;
var utils_1 = require("../utils");
function createEnumChecker(enumVariable, allowForUnknownProps) {
    if (allowForUnknownProps === void 0) { allowForUnknownProps = false; }
    var enumValues = Object.values(enumVariable);
    if (allowForUnknownProps) {
        return function (value) { return typeof value === 'string'; };
    }
    else {
        return function (value) {
            return typeof value === 'string' && enumValues.includes(value);
        };
    }
}
/**
 * Create a schema for a string enumeration.
 */
function stringEnum(enumVariable, allowForUnknownProps) {
    if (allowForUnknownProps === void 0) { allowForUnknownProps = false; }
    var validate = (0, utils_1.toValidator)(createEnumChecker(enumVariable, allowForUnknownProps));
    return (0, utils_1.createSymmetricSchema)({
        type: "Enum<".concat(Object.values(enumVariable).map(utils_1.literalToString).join(','), ">"),
        map: utils_1.identityFn,
        validate: validate,
    });
}
exports.stringEnum = stringEnum;
