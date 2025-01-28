import { createSymmetricSchema, toValidator, coerceStringOrNumberToBigInt } from '../utils.js';
function isValidBigIntValue(value, strict) {
  return strict ? typeof value === 'bigint' : typeof value === 'bigint' || typeof value === 'number' || typeof value === 'string' && /^-?\d+$/.test(value);
}
/** Create a bigint schema */
function bigint() {
  return createSymmetricSchema({
    type: 'bigint',
    validate: toValidator(isValidBigIntValue),
    map: coerceStringOrNumberToBigInt
  });
}
export { bigint };