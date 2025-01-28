import { Schema } from '../schema';
import {
  isNumericString,
  coerceNumericStringToNumber,
  createSymmetricSchema,
  toValidator,
} from '../utils';

function createEnumChecker<T extends string, TEnumValue extends number>(
  enumVariable: { [key in T]: TEnumValue },
  allowForUnknownProps: boolean = false
) {
  const enumValues = Object.values(enumVariable);

  if (allowForUnknownProps) {
    return (value: unknown): value is TEnumValue => isNumericString(value);
  } else {
    return (value: unknown): value is TEnumValue =>
      isNumericString(value) &&
      enumValues.includes(coerceNumericStringToNumber(value));
  }
}

/**
 * Create a schema for a number enumeration.
 */
export function numberEnum<T extends string, TEnumValue extends number>(
  enumVariable: { [key in T]: TEnumValue },
  allowForUnknownProps: boolean = false
): Schema<TEnumValue, TEnumValue> {
  const validate = toValidator(
    createEnumChecker(enumVariable, allowForUnknownProps)
  );

  return createSymmetricSchema({
    type: `Enum<${Object.values(enumVariable)
      .filter((v) => typeof v === 'number')
      .join(',')}>`,
    map: coerceNumericStringToNumber as (value: TEnumValue) => TEnumValue,
    validate,
  });
}
