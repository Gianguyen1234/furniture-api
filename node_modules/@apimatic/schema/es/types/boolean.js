import { createSymmetricSchema, toValidator } from '../utils.js';
function isValidBooleanValue(value, strict) {
  return strict ? typeof value === 'boolean' : typeof value === 'boolean' || typeof value === 'string' && (value === 'true' || value === 'false');
}
/** Create a boolean schema. */
function boolean() {
  return createSymmetricSchema({
    type: 'boolean',
    validate: toValidator(isValidBooleanValue),
    map: function (value) {
      return typeof value === 'boolean' ? value : value === 'true';
    }
  });
}
export { boolean };