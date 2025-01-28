import { createSymmetricSchema, literalToString, toValidator } from '../utils.js';
function literal(literalValue) {
  var validate = function (value) {
    return literalValue === value;
  };
  var map = function () {
    return literalValue;
  };
  return createSymmetricSchema({
    type: "Literal<".concat(literalToString(literalValue), ">"),
    validate: toValidator(validate),
    map: map
  });
}
export { literal };