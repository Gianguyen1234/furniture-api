import { createSymmetricSchema, identityFn } from '../utils.js';

/**
 * Create an unknown schema.
 *
 * The unknown schema allows any value.
 */
function unknown() {
  return createSymmetricSchema({
    type: 'unknown',
    validate: function () {
      return [];
    },
    map: identityFn
  });
}
export { unknown };