import { Schema } from '../schema';
type SchemaType<T extends Schema<any, any>> = T extends Schema<infer U, any> ? U : never;
type ArraySchemaType<T extends Array<Schema<any, any>>> = T[number] extends Schema<any, any> ? SchemaType<T[number]> : never;
type DiscriminatorMap<T extends Array<Schema<any, any>>> = {
    [K in ArraySchemaType<T>]?: Schema<ArraySchemaType<T>>;
};
export declare function anyOf<T extends Array<Schema<any, any>>>(schemas: [...T], discriminatorMap?: DiscriminatorMap<T>, discriminatorField?: string): Schema<ArraySchemaType<T>>;
export {};
//# sourceMappingURL=anyOf.d.ts.map