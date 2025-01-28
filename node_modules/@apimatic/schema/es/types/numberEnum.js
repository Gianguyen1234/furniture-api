import { toValidator, createSymmetricSchema, coerceNumericStringToNumber, isNumericString } from '../utils.js';
function createEnumChecker(enumVariable, allowForUnknownProps) {
  if (allowForUnknownProps === void 0) {
    allowForUnknownProps = false;
  }
  var enumValues = Object.values(enumVariable);
  if (allowForUnknownProps) {
    return function (value) {
      return isNumericString(value);
    };
  } else {
    return function (value) {
      return isNumericString(value) && enumValues.includes(coerceNumericStringToNumber(value));
    };
  }
}
/**
 * Create a schema for a number enumeration.
 */
function numberEnum(enumVariable, allowForUnknownProps) {
  if (allowForUnknownProps === void 0) {
    allowForUnknownProps = false;
  }
  var validate = toValidator(createEnumChecker(enumVariable, allowForUnknownProps));
  return createSymmetricSchema({
    type: "Enum<".concat(Object.values(enumVariable).filter(function (v) {
      return typeof v === 'number';
    }).join(','), ">"),
    map: coerceNumericStringToNumber,
    validate: validate
  });
}
export { numberEnum };