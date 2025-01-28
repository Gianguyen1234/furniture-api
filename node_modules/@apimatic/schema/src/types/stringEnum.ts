import { Schema } from '../schema';
import {
  toValidator,
  createSymmetricSchema,
  identityFn,
  literalToString,
} from '../utils';

function createEnumChecker<T extends string, TEnumValue extends string>(
  enumVariable: { [key in T]: TEnumValue },
  allowForUnknownProps: boolean = false
) {
  const enumValues = Object.values(enumVariable);

  if (allowForUnknownProps) {
    return (value: unknown): value is TEnumValue => typeof value === 'string';
  } else {
    return (value: unknown): value is TEnumValue =>
      typeof value === 'string' && enumValues.includes(value as TEnumValue);
  }
}

/**
 * Create a schema for a string enumeration.
 */
export function stringEnum<T extends string, TEnumValue extends string>(
  enumVariable: { [key in T]: TEnumValue },
  allowForUnknownProps: boolean = false
): Schema<TEnumValue, TEnumValue> {
  const validate = toValidator(
    createEnumChecker(enumVariable, allowForUnknownProps)
  );

  return createSymmetricSchema({
    type: `Enum<${Object.values(enumVariable).map(literalToString).join(',')}>`,
    map: identityFn,
    validate,
  });
}
