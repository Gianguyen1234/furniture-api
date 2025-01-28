import { Schema, SchemaMappedType, SchemaType } from '../schema';
/**
 * Prepares arguments for being sent in the API request.
 *
 * Each argument is validated and converted to a JSON-serialization ready value.
 *
 * If one or more arguments fail validation, an ArgumentsValidationError is
 * thrown, which contains the validation details for all arguments that failed
 * validation.
 *
 * @param params Map of arguments with values and schema
 * @returns Map of serialization-ready argument values
 *
 * @throws ArgumentsValidationError
 */
export declare function prepareArgs<S extends Schema<any, any>, T extends Record<string, [SchemaType<S>, S]>>(params: T): {
    [key in keyof T]: SchemaMappedType<T[key][1]>;
};
//# sourceMappingURL=validate.d.ts.map