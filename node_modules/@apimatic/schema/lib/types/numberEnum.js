"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberEnum = void 0;
var utils_1 = require("../utils");
function createEnumChecker(enumVariable, allowForUnknownProps) {
    if (allowForUnknownProps === void 0) { allowForUnknownProps = false; }
    var enumValues = Object.values(enumVariable);
    if (allowForUnknownProps) {
        return function (value) { return (0, utils_1.isNumericString)(value); };
    }
    else {
        return function (value) {
            return (0, utils_1.isNumericString)(value) &&
                enumValues.includes((0, utils_1.coerceNumericStringToNumber)(value));
        };
    }
}
/**
 * Create a schema for a number enumeration.
 */
function numberEnum(enumVariable, allowForUnknownProps) {
    if (allowForUnknownProps === void 0) { allowForUnknownProps = false; }
    var validate = (0, utils_1.toValidator)(createEnumChecker(enumVariable, allowForUnknownProps));
    return (0, utils_1.createSymmetricSchema)({
        type: "Enum<".concat(Object.values(enumVariable)
            .filter(function (v) { return typeof v === 'number'; })
            .join(','), ">"),
        map: utils_1.coerceNumericStringToNumber,
        validate: validate,
    });
}
exports.numberEnum = numberEnum;
