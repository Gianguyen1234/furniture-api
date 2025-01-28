import { Schema } from '../schema';
/**
 * Create a schema that lazily delegates to the given schema.
 */
export declare function lazy<T, V>(schemaFn: () => Schema<T, V>): Schema<T, V>;
//# sourceMappingURL=lazy.d.ts.map