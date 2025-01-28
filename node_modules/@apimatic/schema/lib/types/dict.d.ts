import { Schema } from '../schema';
/**
 * Create a dictionary schema.
 *
 * This can be used to map/unmap a type like Record<string, something>.
 */
export declare function dict<T, S>(itemSchema: Schema<T, S>): Schema<Record<string, T>, Record<string, S>>;
//# sourceMappingURL=dict.d.ts.map