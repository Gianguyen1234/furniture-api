import {
  Schema,
  SchemaContextCreator,
  SchemaMappedType,
  SchemaType,
  SchemaValidationError,
} from '../schema';
import { objectEntries } from '../utils';
import { ObjectXmlOptions } from './object';

export function discriminatedObject<
  TSchema extends Schema<any, any>,
  TDiscrimProp extends keyof SchemaType<TSchema>,
  TDiscrimMappedProp extends keyof SchemaMappedType<TSchema>,
  TDiscrimMap extends Record<string, TSchema>
>(
  discriminatorMappedPropName: TDiscrimMappedProp,
  discriminatorPropName: TDiscrimProp,
  discriminatorMap: TDiscrimMap,
  defaultDiscriminator: keyof TDiscrimMap,
  xmlOptions?: ObjectXmlOptions
): Schema<any, any> {
  const selectSchemaWithDisc = (
    value: unknown,
    discriminatorProp: string | TDiscrimProp | TDiscrimMappedProp,
    isAttr?: boolean
  ) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      ((isAttr && xmlObjectHasAttribute(value, discriminatorProp as string)) ||
        (!isAttr && (discriminatorProp as string) in value))
    ) {
      const discriminatorValue = isAttr
        ? (value as { $: Record<string, unknown> }).$[
            discriminatorProp as string
          ]
        : (value as Record<typeof discriminatorProp, unknown>)[
            discriminatorProp
          ];
      if (
        typeof discriminatorValue === 'string' &&
        discriminatorValue in discriminatorMap
      ) {
        return discriminatorMap[discriminatorValue];
      }
    }
    return undefined;
  };
  const allSchemas = Object.values(discriminatorMap).reverse();
  const selectSchema = (
    value: unknown,
    discriminatorProp: string | TDiscrimProp | TDiscrimMappedProp,
    validater: (schema: TSchema) => SchemaValidationError[],
    isAttr?: boolean
  ) => {
    const schema = selectSchemaWithDisc(value, discriminatorProp, isAttr);
    if (typeof schema !== 'undefined') {
      return schema;
    }
    // Try checking with discriminator matching
    for (const key in allSchemas) {
      if (validater(allSchemas[key]).length === 0) {
        return allSchemas[key];
      }
    }
    // Fallback to default schema
    return discriminatorMap[defaultDiscriminator];
  };

  const mapJsonSchema = (value: unknown, ctxt: SchemaContextCreator) =>
    selectSchema(value, discriminatorPropName, (schema) =>
      schema.validateBeforeMap(value, ctxt)
    );

  const mapXmlSchema = (value: unknown, ctxt: SchemaContextCreator) =>
    selectSchema(
      value,
      xmlOptions?.xmlName ?? discriminatorPropName,
      (schema) => schema.validateBeforeMapXml(value, ctxt),
      xmlOptions?.isAttr
    );

  const unmapSchema = (value: unknown, ctxt: SchemaContextCreator) =>
    selectSchema(value, discriminatorMappedPropName, (schema) =>
      schema.validateBeforeUnmap(value, ctxt)
    );

  return {
    type: () =>
      `DiscriminatedUnion<${discriminatorPropName as string},[${objectEntries(
        discriminatorMap
      )
        .map(([_, v]) => v.type)
        .join(',')}]>`,
    map: (value, ctxt) => mapJsonSchema(value, ctxt).map(value, ctxt),
    unmap: (value, ctxt) => unmapSchema(value, ctxt).unmap(value, ctxt),
    validateBeforeMap: (value, ctxt) =>
      mapJsonSchema(value, ctxt).validateBeforeMap(value, ctxt),
    validateBeforeUnmap: (value, ctxt) =>
      unmapSchema(value, ctxt).validateBeforeUnmap(value, ctxt),
    mapXml: (value, ctxt) => mapXmlSchema(value, ctxt).mapXml(value, ctxt),
    unmapXml: (value, ctxt) => unmapSchema(value, ctxt).unmapXml(value, ctxt),
    validateBeforeMapXml: (value, ctxt) =>
      mapXmlSchema(value, ctxt).validateBeforeMapXml(value, ctxt),
  };
}

function xmlObjectHasAttribute(value: object, prop: string): boolean {
  return (
    '$' in value &&
    typeof (value as { $: unknown }).$ === 'object' &&
    (prop as string) in (value as { $: Record<string, unknown> }).$
  );
}
