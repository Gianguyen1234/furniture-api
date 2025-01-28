import { toValidator, createSymmetricSchema, literalToString, identityFn } from '../utils.js';
function createEnumChecker(enumVariable, allowForUnknownProps) {
  if (allowForUnknownProps === void 0) {
    allowForUnknownProps = false;
  }
  var enumValues = Object.values(enumVariable);
  if (allowForUnknownProps) {
    return function (value) {
      return typeof value === 'string';
    };
  } else {
    return function (value) {
      return typeof value === 'string' && enumValues.includes(value);
    };
  }
}
/**
 * Create a schema for a string enumeration.
 */
function stringEnum(enumVariable, allowForUnknownProps) {
  if (allowForUnknownProps === void 0) {
    allowForUnknownProps = false;
  }
  var validate = toValidator(createEnumChecker(enumVariable, allowForUnknownProps));
  return createSymmetricSchema({
    type: "Enum<".concat(Object.values(enumVariable).map(literalToString).join(','), ">"),
    map: identityFn,
    validate: validate
  });
}
export { stringEnum };