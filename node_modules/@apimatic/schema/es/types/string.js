import { createSymmetricSchema, toValidator, identityFn } from '../utils.js';
function isValidStringValue(value) {
  return typeof value === 'string';
}
/** Create a string schema. */
function string() {
  return createSymmetricSchema({
    type: 'string',
    validate: toValidator(isValidStringValue),
    map: identityFn
  });
}
export { string };