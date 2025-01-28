/**
 * Schema defines a type and its validation and mapping functions.
 */
export interface Schema<T, S = any> {
    type: () => string;
    validateBeforeMap: (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[];
    validateBeforeUnmap: (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[];
    map: (value: S, ctxt: SchemaContextCreator) => T;
    unmap: (value: T, ctxt: SchemaContextCreator) => S;
    validateBeforeMapXml: (value: unknown, ctxt: SchemaContextCreator) => SchemaValidationError[];
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
export type SchemaMappedType<T extends Schema<any, any>> = ReturnType<T['unmap']>;
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
    createChild<T, S extends Schema<any, any>>(key: any, value: T, childSchema: S): SchemaContextCreator;
    flatmapChildren<K extends string | number, T, S extends Schema<any, any>, R>(items: Array<[K, T]>, itemSchema: S, mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R[]): R[];
    mapChildren<K extends string | number, T, S extends Schema<any, any>, R>(items: Array<[K, T]>, itemSchema: S, mapper: (item: [K, T], childCtxt: SchemaContextCreator) => R): R[];
    fail(message?: string): SchemaValidationError[];
}
/**
 * Validation result after running validation.
 */
export type ValidationResult<T> = {
    errors: false;
    result: T;
} | {
    errors: SchemaValidationError[];
};
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
export declare function validateAndMap<T extends Schema<any, any>>(value: SchemaMappedType<T>, schema: T): ValidationResult<SchemaType<T>>;
/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before JSON serializatin.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
export declare function validateAndUnmap<T extends Schema<any, any>>(value: SchemaType<T>, schema: T): ValidationResult<SchemaMappedType<T>>;
/**
 * Validate and map the value using the given schema.
 *
 * This method should be used after XML deserialization.
 *
 * @param value Value to map
 * @param schema Schema for type
 */
export declare function validateAndMapXml<T extends Schema<any, any>>(value: unknown, schema: T): ValidationResult<SchemaType<T>>;
/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before XML serialization.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
export declare function validateAndUnmapXml<T extends Schema<any, any>>(value: SchemaType<T>, schema: T): ValidationResult<unknown>;
//# sourceMappingURL=schema.d.ts.map