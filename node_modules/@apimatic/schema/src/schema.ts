import { isOptionalNullable, objectKeyEncode } from './utils';

/**
 * Schema defines a type and its validation and mapping functions.
 */
export interface Schema<T, S = any> {
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

  validateBeforeMapXml: (
    value: unknown,
    ctxt: SchemaContextCreator
  ) => SchemaValidationError[];
  mapXml: (value: any, ctxt: SchemaContextCreator) => T;
  unmapXml: (value: T, ctxt: SchemaContextCreator) => any;
}

/**
 * Type for a Schema
 */
export type SchemaType<T extends Schema<any, any>> = ReturnType<T['map']>;

/**
 * Mapped type for the Schema
 */
export type SchemaMappedType<T extends Schema<any, any>> = ReturnType<
  T['unmap']
>;

/**
 * Schema context when validating or mapping
 */
export interface SchemaContext {
  readonly value: unknown;
  readonly type: string;
  readonly branch: unknown[];
  readonly path: Array<string | number>;
  strictValidation?: boolean;
}

/**
 * SchemaContextCreator provides schema context as well as utility methods for
 * interacting with the context from inside the validation or mapping methods.
 */
export interface SchemaContextCreator extends SchemaContext {
  createChild<T, S extends Schema<any, any>>(
    key: any,
    value: T,
    childSchema: S
  ): SchemaContextCreator;
  flatmapChildren<K extends string | number, T, S extends Schema<any, any>, R>(
    items: Array<[K, T]>,
    itemSchema: S,
    mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R[]
  ): R[];
  mapChildren<K extends string | number, T, S extends Schema<any, any>, R>(
    items: Array<[K, T]>,
    itemSchema: S,
    mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R
  ): R[];
  fail(message?: string): SchemaValidationError[];
}

/**
 * Validation result after running validation.
 */
export type ValidationResult<T> =
  | { errors: false; result: T }
  | { errors: SchemaValidationError[] };

/**
 * Schema validation error
 */
export interface SchemaValidationError extends SchemaContext {
  readonly message?: string;
}

/**
 * Validate and map the value using the given schema.
 *
 * This method should be used after JSON deserialization.
 *
 * @param value Value to map
 * @param schema Schema for type
 */
export function validateAndMap<T extends Schema<any, any>>(
  value: SchemaMappedType<T>,
  schema: T
): ValidationResult<SchemaType<T>> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type())
  );
  const validationResult = schema.validateBeforeMap(value, contextCreator);
  if (validationResult.length === 0) {
    if (isOptionalNullable(schema.type(), value)) {
      return { errors: false, result: value };
    }
    return { errors: false, result: schema.map(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before JSON serializatin.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
export function validateAndUnmap<T extends Schema<any, any>>(
  value: SchemaType<T>,
  schema: T
): ValidationResult<SchemaMappedType<T>> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type())
  );
  const validationResult = schema.validateBeforeUnmap(value, contextCreator);
  if (validationResult.length === 0) {
    return { errors: false, result: schema.unmap(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

/**
 * Validate and map the value using the given schema.
 *
 * This method should be used after XML deserialization.
 *
 * @param value Value to map
 * @param schema Schema for type
 */
export function validateAndMapXml<T extends Schema<any, any>>(
  value: unknown,
  schema: T
): ValidationResult<SchemaType<T>> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type())
  );
  const validationResult = schema.validateBeforeMapXml(value, contextCreator);
  if (validationResult.length === 0) {
    return { errors: false, result: schema.mapXml(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before XML serialization.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
export function validateAndUnmapXml<T extends Schema<any, any>>(
  value: SchemaType<T>,
  schema: T
): ValidationResult<unknown> {
  const contextCreator = createSchemaContextCreator(
    createNewSchemaContext(value, schema.type())
  );
  const validationResult = schema.validateBeforeUnmap(value, contextCreator);
  if (validationResult.length === 0) {
    return { errors: false, result: schema.unmapXml(value, contextCreator) };
  } else {
    return { errors: validationResult };
  }
}

/**
 * Create a new schema context using the given value and type.
 */
function createNewSchemaContext(
  value: unknown,
  type: string,
  strict?: boolean
): SchemaContext {
  return {
    value,
    type,
    branch: [value],
    path: [],
    strictValidation: strict,
  };
}

/**
 * Create a new SchemaContextCreator for the given SchemaContext.
 */
function createSchemaContextCreator(
  currentContext: SchemaContext
): SchemaContextCreator {
  const createChildContext: SchemaContextCreator['createChild'] = (
    key,
    value,
    childSchema
  ) =>
    createSchemaContextCreator({
      value,
      type: childSchema.type(),
      branch: currentContext.branch.concat(value),
      path: currentContext.path.concat(key),
      strictValidation: currentContext.strictValidation,
    });

  const mapChildren: SchemaContextCreator['mapChildren'] = (
    items,
    itemSchema,
    mapper
  ) =>
    items.map((item) =>
      mapper(item, createChildContext(item[0], item[1], itemSchema))
    );

  return {
    ...currentContext,
    createChild: createChildContext,
    flatmapChildren: (...args) => flatten(mapChildren(...args)),
    mapChildren,
    fail: (message) => [
      {
        value: currentContext.value,
        type: currentContext.type,
        branch: currentContext.branch,
        path: currentContext.path,
        message: createErrorMessage(currentContext, message),
      },
    ],
  };
}

function createErrorMessage(ctxt: SchemaContext, message?: string): string {
  const giveValue = JSON.stringify(ctxt.value, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  message =
    (message ??
      `Expected value to be of type '${
        ctxt.type
      }' but found '${typeof ctxt.value}'.`) +
    '\n' +
    `\nGiven value: ${giveValue}` +
    `\nType: '${typeof ctxt.value}'` +
    `\nExpected type: '${ctxt.type}'`;

  if (ctxt.path.length > 0) {
    const pathString = ctxt.path
      .map((value) => objectKeyEncode(value.toString()))
      .join(' › ');
    message += `\nPath: ${pathString}`;
  }

  return message;
}

function flatten<T>(array: T[][]): T[] {
  const output: T[] = [];
  for (const ele of array) {
    for (const x of ele) {
      output.push(x);
    }
  }
  return output;
}
