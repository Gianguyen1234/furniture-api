import { createSymmetricSchema, toValidator, isNumericString, coerceNumericStringToNumber } from '../utils.js';

/** Create a number schema. */
function number() {
  return createSymmetricSchema({
    type: 'number',
    validate: toValidator(isNumericString),
    map: coerceNumericStringToNumber
  });
}
export { number };