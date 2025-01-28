import { Schema } from '../schema';
/**
 * Create a literal schema.
 *
 * This schema always unmaps/maps to the constant value provided in the schema,
 * regardless of the value being mapped/unmapped. The validation always passes.
 */
export declare function literal<T extends boolean>(literalValue: T): Schema<T, T>;
export declare function literal<T extends number>(literalValue: T): Schema<T, T>;
export declare function literal<T extends string>(literalValue: T): Schema<T, T>;
export declare function literal<T>(literalValue: T): Schema<T, T>;
//# sourceMappingURL=literal.d.ts.map