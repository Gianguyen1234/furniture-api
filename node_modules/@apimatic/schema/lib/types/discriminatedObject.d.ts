import { Schema, SchemaMappedType, SchemaType } from '../schema';
import { ObjectXmlOptions } from './object';
export declare function discriminatedObject<TSchema extends Schema<any, any>, TDiscrimProp extends keyof SchemaType<TSchema>, TDiscrimMappedProp extends keyof SchemaMappedType<TSchema>, TDiscrimMap extends Record<string, TSchema>>(discriminatorMappedPropName: TDiscrimMappedProp, discriminatorPropName: TDiscrimProp, discriminatorMap: TDiscrimMap, defaultDiscriminator: keyof TDiscrimMap, xmlOptions?: ObjectXmlOptions): Schema<any, any>;
//# sourceMappingURL=discriminatedObject.d.ts.map