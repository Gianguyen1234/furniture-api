import { Schema } from '../schema';
/**
 * Create a 'defaults' schema.
 *
 * During mapping or unmapping, if the value is null or undefined, the schema
 * defaults to the 'defaultValue' specified in the schema.
 */
export declare function defaults<M, U, V extends M & U>(schema: Schema<M, U>, defaultValue: V): Schema<M, U>;
//# sourceMappingURL=defaults.d.ts.map