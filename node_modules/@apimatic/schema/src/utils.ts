/**
 * Utilities for internal library usage
 */

import { Schema, SchemaContextCreator, SchemaValidationError } from './schema';

export function arrayEntries<T>(arr: T[]) {
  const entries: Array<[number, T]> = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    entries.push([index, element]);
  }
  return entries;
}

export function objectEntries<T extends Record<string, unknown>>(
  obj: T
): Array<[Extract<keyof T, string>, T[keyof T]]> {
  const ownProps = Object.keys(obj);
  let i = ownProps.length;
  const resArray = new Array(i); // preallocate the Array
  while (i--) {
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  }

  return resArray;
}

export function literalToString(value: any): string {
  return typeof value === 'string'
    ? `"${value.replace(/"/g, '"')}"`
    : `${value}`;
}

export function identityFn<T>(value: T): T {
  return value;
}

export function toValidator(
  fn: (value: unknown, strict?: boolean) => boolean
): (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[] {
  return (value, ctxt) => (fn(value, ctxt.strictValidation) ? [] : ctxt.fail());
}

/**
 * Schema in which the mapping and unmapping is done the same way
 */
export interface SymmetricSchema<T> {
  type: string;
  validate: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  map: (value: T, ctxt: SchemaContextCreator) => T;
}

/**
 * Create a schema in which the mapping and unmapping is done the same way
 */
export function createSymmetricSchema<T>(
  schema: SymmetricSchema<T>
): Schema<T, T> {
  return createBasicSchema({
    type: () => schema.type,
    validateBeforeMap: schema.validate,
    validateBeforeUnmap: schema.validate,
    map: schema.map,
    unmap: schema.map,
  });
}

interface BasicSchema<T, S = unknown> {
  type: () => string;
  validateBeforeMap: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  validateBeforeUnmap: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  map: (value: S, ctxt: SchemaContextCreator) => T;
  unmap: (value: T, ctxt: SchemaContextCreator) => S;
}

/** Create a basic schema where XML mapping and validation is the same as for JSON */
function createBasicSchema<T, S>(basicSchema: BasicSchema<T, S>): Schema<T, S> {
  return {
    ...basicSchema,
    validateBeforeMapXml: basicSchema.validateBeforeUnmap,
    mapXml: basicSchema.map,
    unmapXml: basicSchema.unmap,
  };
}

export function isNumericString(
  value: unknown,
  strict?: boolean
): value is number | string {
  return strict
    ? typeof value === 'number'
    : typeof value === 'number' ||
        (typeof value === 'string' && !isNaN(value as any));
}

export function coerceNumericStringToNumber(value: number | string): number {
  return typeof value === 'number' ? value : +value;
}

export function coerceStringOrNumberToBigInt(
  value: bigint | string | number
): bigint {
  return typeof value === 'bigint' ? value : BigInt(value);
}

export function once<Args extends any[], R>(
  func: (...args: Args) => R
): (...args: Args) => R {
  let ran = false;
  let memo: R;
  return function (this: any, ...args) {
    if (ran) {
      return memo;
    }
    ran = true;
    memo = func.apply(this, args);
    return memo;
  };
}

/**
 * Returns a copy of the object with the given keys omitted.
 */
export function omitKeysFromObject(
  object: Record<string, unknown>,
  keysToOmit: string[]
): Record<string, unknown> {
  const omitSet = new Set(keysToOmit);
  const output: Record<string, unknown> = {};
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      !omitSet.has(key)
    ) {
      output[key] = object[key];
    }
  }
  return output;
}

export function objectKeyEncode(key: string): string {
  return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}

export function isNullOrMissing(value: unknown): value is null | undefined {
  return value === null || typeof value === 'undefined';
}

export function isOptional(type: string, value: unknown): boolean {
  return type.startsWith('Optional<') && typeof value === 'undefined';
}

export function isOptionalNullable(type: string, value: unknown): boolean {
  return isOptionalAndNullableType(type) && isNullOrMissing(value);
}

export function isOptionalAndNullableType(type: string): boolean {
  return (
    type.startsWith('Optional<Nullable<') ||
    type.startsWith('Nullable<Optional<')
  );
}

export function isOptionalOrNullableType(type: string): boolean {
  return type.startsWith('Optional<') || type.startsWith('Nullable<');
}
