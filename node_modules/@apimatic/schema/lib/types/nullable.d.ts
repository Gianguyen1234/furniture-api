import { Schema } from '../schema';
/**
 * Creates a nullable schema.
 *
 * The nullable schema allows null values or the values allowed by the given
 * 'schema'.
 */
export declare function nullable<T, S>(schema: Schema<T, S>): Schema<T | null, S | null | undefined>;
//# sourceMappingURL=nullable.d.ts.map