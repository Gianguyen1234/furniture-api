import { Schema } from '../schema';
import { createSymmetricSchema, identityFn, toValidator } from '../utils';

function isValidStringValue(value: unknown): value is string {
  return typeof value === 'string';
}

/** Create a string schema. */
export function string(): Schema<string, string> {
  return createSymmetricSchema({
    type: 'string',
    validate: toValidator(isValidStringValue),
    map: identityFn,
  });
}
