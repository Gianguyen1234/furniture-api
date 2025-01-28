import { Schema } from '../schema';
/**
 * Create an optional schema.
 *
 * The optional schema allows 'undefined' or the values allowed by the given
 * 'schema'.
 */
export declare function optional<T, S>(schema: Schema<T, S>): Schema<T | undefined, S | undefined | null>;
//# sourceMappingURL=optional.d.ts.map