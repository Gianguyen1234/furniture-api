import { Schema } from '../schema';
/**
 * Create a schema for a string enumeration.
 */
export declare function stringEnum<T extends string, TEnumValue extends string>(enumVariable: {
    [key in T]: TEnumValue;
}, allowForUnknownProps?: boolean): Schema<TEnumValue, TEnumValue>;
//# sourceMappingURL=stringEnum.d.ts.map