import {
  Schema,
  SchemaContextCreator,
  SchemaMappedType,
  SchemaType,
  SchemaValidationError,
  validateAndMap,
  validateAndUnmap,
} from '../schema';
import { OptionalizeObject } from '../typeUtils';
import {
  isOptional,
  isOptionalNullable,
  isOptionalOrNullableType,
  literalToString,
  objectEntries,
  objectKeyEncode,
  omitKeysFromObject,
} from '../utils';
import { dict } from './dict';
import { optional } from './optional';

type AnyObjectSchema = Record<
  string,
  [string, Schema<any, any>, ObjectXmlOptions?]
>;

type AllValues<T extends AnyObjectSchema> = {
  [P in keyof T]: { key: P; value: T[P][0]; schema: T[P][1] };
}[keyof T];

export type MappedObjectType<T extends AnyObjectSchema> = OptionalizeObject<
  {
    [P in AllValues<T>['value']]: SchemaMappedType<
      Extract<AllValues<T>, { value: P }>['schema']
    >;
  }
>;

export type ObjectType<T extends AnyObjectSchema> = OptionalizeObject<
  {
    [K in keyof T]: SchemaType<T[K][1]>;
  }
>;

export interface ObjectXmlOptions {
  isAttr?: boolean;
  xmlName?: string;
}

export interface StrictObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
> extends Schema<ObjectType<T>, MappedObjectType<T>> {
  readonly objectSchema: T;
}

export interface ObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
> extends Schema<
    ObjectType<T> & { [key: string]: unknown },
    MappedObjectType<T> & { [key: string]: unknown }
  > {
  readonly objectSchema: T;
}

export interface ExtendedObjectSchema<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  K extends string,
  U
> extends Schema<
    ObjectType<T> & { [key in K]?: Record<string, U> },
    MappedObjectType<T> & { [key in K]?: Record<string, U> }
  > {
  readonly objectSchema: T;
}

/**
 * Create a Strict Object type schema.
 *
 * A strict-object does not allow additional properties during mapping or
 * unmapping. Additional properties will result in a validation error.
 */
export function strictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(objectSchema: T): StrictObjectSchema<V, T> {
  const schema = internalObject(objectSchema, false, false);
  schema.type = () =>
    `StrictObject<{${Object.keys(objectSchema)
      .map(objectKeyEncode)
      .join(',')}}>`;
  return schema;
}

/**
 * Create an Expandable Object type schema, allowing all additional properties.
 *
 * The object schema allows additional properties during mapping and unmapping. The
 * additional properties are copied over as is.
 */
export function expandoObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(objectSchema: T): ObjectSchema<V, T> {
  return internalObject(objectSchema, true, true);
}

/**
 * Create an Expandable Object type schema, allowing only typed additional properties.
 *
 * The object schema allows additional properties during mapping and unmapping. The
 * additional properties are copied over in a Record<string, SchemaType<S>>
 * with key represented by K.
 */
export function typedExpandoObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  K extends string,
  S extends Schema<any, any>
>(
  objectSchema: T,
  additionalPropertyKey: K,
  additionalPropertySchema: S
): ExtendedObjectSchema<V, T, K, SchemaType<S>> {
  return internalObject(objectSchema, true, [
    additionalPropertyKey,
    optional(dict(additionalPropertySchema)),
  ]);
}

/**
 * Create an Object Type schema.
 *
 * The Object schema allows additional properties during mapping and unmapping
 * but discards them.
 */
export function object<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(objectSchema: T): StrictObjectSchema<V, T> {
  const schema = internalObject(objectSchema, true, false);
  schema.type = () =>
    `Object<{${Object.keys(objectSchema).map(objectKeyEncode).join(',')}}>`;
  return schema;
}

/**
 * Create a strict-object schema that extends an existing schema.
 */
export function extendStrictObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: StrictObjectSchema<V, T>,
  objectSchema: B
): StrictObjectSchema<string, T & B> {
  return strictObject({ ...parentObjectSchema.objectSchema, ...objectSchema });
}

/**
 * Create an object schema that extends an existing schema.
 */
export function extendExpandoObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: ObjectSchema<V, T>,
  objectSchema: B
): ObjectSchema<string, T & B> {
  return expandoObject({ ...parentObjectSchema.objectSchema, ...objectSchema });
}

/**
 * Create an Object schema that extends an existing object schema.
 */
export function extendObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>,
  A extends string,
  B extends Record<string, [A, Schema<any, any>, ObjectXmlOptions?]>
>(
  parentObjectSchema: StrictObjectSchema<V, T>,
  objectSchema: B
): StrictObjectSchema<string, T & B> {
  return object({ ...parentObjectSchema.objectSchema, ...objectSchema });
}

/**
 * Internal utility to create object schema with different options.
 */
function internalObject<
  V extends string,
  T extends Record<string, [V, Schema<any, any>, ObjectXmlOptions?]>
>(
  objectSchema: T,
  skipAdditionalPropValidation: boolean,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
): StrictObjectSchema<V, T> {
  const keys = Object.keys(objectSchema);
  const reverseObjectSchema = createReverseObjectSchema(objectSchema);
  const xmlMappingInfo = getXmlPropMappingForObjectSchema(objectSchema);
  const xmlObjectSchema = createXmlObjectSchema(objectSchema);
  const reverseXmlObjectSchema = createReverseXmlObjectSchema(xmlObjectSchema);
  return {
    type: () => `Object<{${keys.map(objectKeyEncode).join(',')},...}>`,
    validateBeforeMap: validateObject(
      objectSchema,
      'validateBeforeMap',
      skipAdditionalPropValidation,
      mapAdditionalProps
    ),
    validateBeforeUnmap: validateObject(
      reverseObjectSchema,
      'validateBeforeUnmap',
      skipAdditionalPropValidation,
      mapAdditionalProps
    ),
    map: mapObject(objectSchema, 'map', mapAdditionalProps),
    unmap: mapObject(reverseObjectSchema, 'unmap', mapAdditionalProps),
    validateBeforeMapXml: validateObjectBeforeMapXml(
      objectSchema,
      xmlMappingInfo,
      skipAdditionalPropValidation,
      mapAdditionalProps
    ),
    mapXml: mapObjectFromXml(xmlObjectSchema, mapAdditionalProps),
    unmapXml: unmapObjectToXml(reverseXmlObjectSchema, mapAdditionalProps),
    objectSchema,
  };
}

function validateObjectBeforeMapXml(
  objectSchema: Record<string, [string, Schema<any>, ObjectXmlOptions?]>,
  xmlMappingInfo: ReturnType<typeof getXmlPropMappingForObjectSchema>,
  skipAdditionalPropValidation: boolean,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
) {
  const { elementsToProps, attributesToProps } = xmlMappingInfo;
  return (
    value: unknown,
    ctxt: SchemaContextCreator
  ): SchemaValidationError[] => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    if (Array.isArray(value)) {
      return ctxt.fail(
        `Expected value to be of type '${
          ctxt.type
        }' but found 'Array<${typeof value}>'.`
      );
    }
    const valueObject = value as {
      $?: Record<string, unknown>;
      [key: string]: unknown;
    };
    const { $: attrs, ...elements } = valueObject;

    let validationObj = {
      validationMethod: 'validateBeforeMapXml',
      propTypeName: 'child elements',
      propTypePrefix: 'element',
      valueTypeName: 'element',
      propMapping: elementsToProps,
      objectSchema,
      valueObject: elements,
      ctxt,
      skipAdditionalPropValidation,
      mapAdditionalProps,
    };
    // Validate all known elements using the schema
    const elementErrors = validateValueObject(validationObj);

    validationObj = {
      ...validationObj,
      propTypeName: 'attributes',
      propTypePrefix: '@',
      propMapping: attributesToProps,
      valueObject: attrs ?? {},
    };
    // Validate all known attributes using the schema
    const attributesErrors = validateValueObject(validationObj);

    return elementErrors.concat(attributesErrors);
  };
}

function mapObjectFromXml(
  xmlObjectSchema: XmlObjectSchema,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(elementsSchema, 'mapXml', mapAdditionalProps);
  const mapAttributes = mapObject(
    attributesSchema,
    'mapXml',
    false // Always false; additional attributes are handled differently below.
  );

  // These are later used to omit know attribute props from the attributes object
  // so that the remaining props can be copied over as additional props.
  const attributeKeys = objectEntries(attributesSchema).map(
    ([_, [name]]) => name
  );

  return (value: unknown, ctxt: SchemaContextCreator): any => {
    const valueObject = value as {
      $?: Record<string, unknown>;
      [key: string]: unknown;
    };
    const { $: attrs, ...elements } = valueObject;
    const attributes = attrs ?? {};

    const output: Record<string, unknown> = {
      ...mapAttributes(attributes, ctxt),
      ...mapElements(elements, ctxt),
    };

    if (mapAdditionalProps) {
      // Omit known attributes and copy the rest as additional attributes.
      const additionalAttrs = omitKeysFromObject(attributes, attributeKeys);
      if (Object.keys(additionalAttrs).length > 0) {
        // These additional attrs are set in the '$' property by convention.
        output.$ = additionalAttrs;
      }
    }

    return output;
  };
}

function unmapObjectToXml(
  xmlObjectSchema: XmlObjectSchema,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
) {
  const { elementsSchema, attributesSchema } = xmlObjectSchema;
  const mapElements = mapObject(elementsSchema, 'unmapXml', mapAdditionalProps);
  const mapAttributes = mapObject(
    attributesSchema,
    'unmapXml',
    false // Always false so that element props are not copied during mapping
  );

  // These are later used to omit attribute props from the value object so that they
  // do not get mapped during element mapping, if the mapAdditionalProps is set.
  const attributeKeys = objectEntries(attributesSchema).map(
    ([_, [name]]) => name
  );

  return (value: unknown, ctxt: SchemaContextCreator): any => {
    // Get additional attributes which are set in the '$' property by convention
    const { $: attributes, ...rest } = value as {
      $?: unknown;
      [key: string]: unknown;
    };

    // Ensure 'attributes' is an object and non-null
    const additionalAttributes =
      typeof attributes === 'object' &&
      attributes !== null &&
      mapAdditionalProps
        ? attributes
        : {};

    return {
      ...mapElements(omitKeysFromObject(rest, attributeKeys), ctxt),
      $: { ...additionalAttributes, ...mapAttributes(value, ctxt) },
    };
  };
}

function validateValueObject({
  validationMethod,
  propTypeName,
  propTypePrefix,
  valueTypeName,
  propMapping,
  objectSchema,
  valueObject,
  ctxt,
  skipAdditionalPropValidation,
  mapAdditionalProps,
}: {
  validationMethod: string;
  propTypeName: string;
  propTypePrefix: string;
  valueTypeName: string;
  propMapping: Record<string, string>;
  objectSchema: AnyObjectSchema;
  valueObject: { [key: string]: any };
  ctxt: SchemaContextCreator;
  skipAdditionalPropValidation: boolean;
  mapAdditionalProps: boolean | [string, Schema<any, any>];
}) {
  const errors: SchemaValidationError[] = [];
  const missingProps: Set<string> = new Set();
  const conflictingProps: Set<string> = new Set();
  const unknownProps: Set<string> = new Set(Object.keys(valueObject));

  if (
    validationMethod !== 'validateBeforeMap' &&
    typeof mapAdditionalProps !== 'boolean' &&
    mapAdditionalProps[0] in valueObject
  ) {
    for (const [key, _] of Object.entries(valueObject[mapAdditionalProps[0]])) {
      if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
        conflictingProps.add(key);
      }
    }
  }

  // Create validation errors for conflicting additional properties keys
  addErrorsIfAny(
    conflictingProps,
    (names) =>
      createErrorMessage(
        `Some keys in additional properties are conflicting with the keys in`,
        valueTypeName,
        names
      ),
    errors,
    ctxt
  );

  // Validate all known properties using the schema
  for (const key in propMapping) {
    if (Object.prototype.hasOwnProperty.call(propMapping, key)) {
      const propName = propMapping[key];
      const schema = objectSchema[propName][1];
      unknownProps.delete(key);
      if (key in valueObject) {
        schema[validationMethod](
          valueObject[key],
          ctxt.createChild(propTypePrefix + key, valueObject[key], schema)
        ).forEach((e) => errors.push(e));
      } else if (!isOptionalOrNullableType(schema.type())) {
        // Add to missing keys if it is not an optional property
        missingProps.add(key);
      }
    }
  }

  // Create validation error for unknown properties encountered
  if (!skipAdditionalPropValidation) {
    addErrorsIfAny(
      unknownProps,
      (names) =>
        createErrorMessage(
          `Some unknown ${propTypeName} were found in the`,
          valueTypeName,
          names
        ),
      errors,
      ctxt
    );
  }

  // Create validation error for missing required properties
  addErrorsIfAny(
    missingProps,
    (names) =>
      createErrorMessage(
        `Some ${propTypeName} are missing in the`,
        valueTypeName,
        names
      ),
    errors,
    ctxt
  );

  return errors;
}

function createErrorMessage(
  message: string,
  type: string,
  properties: string[]
): string {
  return `${message} ${type}: ${properties.map(literalToString).join(', ')}.`;
}

function addErrorsIfAny(
  conflictingProps: Set<string>,
  messageGetter: (propNames: string[]) => string,
  errors: SchemaValidationError[],
  ctxt: SchemaContextCreator
) {
  const conflictingPropsArray = Array.from(conflictingProps);
  if (conflictingPropsArray.length > 0) {
    const message = messageGetter(conflictingPropsArray);
    ctxt.fail(message).forEach((e) => errors.push(e));
  }
}

function validateObject(
  objectSchema: AnyObjectSchema,
  validationMethod:
    | 'validateBeforeMap'
    | 'validateBeforeUnmap'
    | 'validateBeforeMapXml',
  skipAdditionalPropValidation: boolean,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
) {
  const propMapping = getPropMappingForObjectSchema(objectSchema);
  return (value: unknown, ctxt: SchemaContextCreator) => {
    if (typeof value !== 'object' || value === null) {
      return ctxt.fail();
    }
    if (Array.isArray(value)) {
      return ctxt.fail(
        `Expected value to be of type '${
          ctxt.type
        }' but found 'Array<${typeof value}>'.`
      );
    }
    return validateValueObject({
      validationMethod,
      propTypeName: 'properties',
      propTypePrefix: '',
      valueTypeName: 'object',
      propMapping,
      objectSchema,
      valueObject: value as Record<string, any>,
      ctxt,
      skipAdditionalPropValidation,
      mapAdditionalProps,
    });
  };
}

function mapObject<T extends AnyObjectSchema>(
  objectSchema: T,
  mappingFn: 'map' | 'unmap' | 'mapXml' | 'unmapXml',
  mapAdditionalProps: boolean | [string, Schema<any, any>]
) {
  return (value: unknown, ctxt: SchemaContextCreator): any => {
    const output: Record<string, unknown> = {};
    const objectValue = { ...(value as Record<string, any>) };
    const isUnmaping = mappingFn === 'unmap' || mappingFn === 'unmapXml';

    if (
      isUnmaping &&
      typeof mapAdditionalProps !== 'boolean' &&
      mapAdditionalProps[0] in objectValue
    ) {
      // Pre process to flatten additional properties in objectValue
      Object.entries(objectValue[mapAdditionalProps[0]]).forEach(
        ([k, v]) => (objectValue[k] = v)
      );
      delete objectValue[mapAdditionalProps[0]];
    }

    // Map known properties to output using the schema
    Object.entries(objectSchema).forEach(([key, element]) => {
      const propName = element[0];
      const propValue = objectValue[propName];
      delete objectValue[propName];

      if (isOptionalNullable(element[1].type(), propValue)) {
        if (typeof propValue === 'undefined') {
          // Skip mapping to avoid creating properties with value 'undefined'
          return;
        }
        output[key] = null;
        return;
      }

      if (isOptional(element[1].type(), propValue)) {
        // Skip mapping to avoid creating properties with value 'undefined'
        return;
      }

      output[key] = element[1][mappingFn](
        propValue,
        ctxt.createChild(propName, propValue, element[1])
      );
    });

    // Copy the additional unknown properties in output when allowed
    Object.entries(
      extractAdditionalProperties(objectValue, isUnmaping, mapAdditionalProps)
    ).forEach(([k, v]) => (output[k] = v));

    return output;
  };
}

function extractAdditionalProperties(
  objectValue: Record<string, any>,
  isUnmaping: boolean,
  mapAdditionalProps: boolean | [string, Schema<any, any>]
): Record<string, any> {
  const properties: Record<string, any> = {};

  if (!mapAdditionalProps) {
    return properties;
  }

  if (typeof mapAdditionalProps === 'boolean') {
    Object.entries(objectValue).forEach(([k, v]) => (properties[k] = v));
    return properties;
  }

  Object.entries(objectValue).forEach(([k, v]) => {
    const testValue = { [k]: v };
    const mappingResult = isUnmaping
      ? validateAndUnmap(testValue, mapAdditionalProps[1])
      : validateAndMap(testValue, mapAdditionalProps[1]);
    if (mappingResult.errors) {
      return;
    }
    properties[k] = mappingResult.result[k];
  });

  if (isUnmaping || Object.entries(properties).length === 0) {
    return properties;
  }

  return { [mapAdditionalProps[0]]: properties };
}

function getXmlPropMappingForObjectSchema(objectSchema: AnyObjectSchema) {
  const elementsToProps: Record<string, string> = {};
  const attributesToProps: Record<string, string> = {};

  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const [propName, , xmlOptions] = objectSchema[key];
      if (xmlOptions?.isAttr === true) {
        attributesToProps[xmlOptions.xmlName ?? propName] = key;
      } else {
        elementsToProps[xmlOptions?.xmlName ?? propName] = key;
      }
    }
  }

  return { elementsToProps, attributesToProps };
}

function getPropMappingForObjectSchema(
  objectSchema: AnyObjectSchema
): Record<string, string> {
  const propsMapping: Record<string, string> = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const propDef = objectSchema[key];
      propsMapping[propDef[0]] = key;
    }
  }
  return propsMapping;
}

const createReverseObjectSchema = <T extends AnyObjectSchema>(
  objectSchema: T
): AnyObjectSchema =>
  Object.entries(objectSchema).reduce(
    (result, [key, element]) => ({
      ...result,
      [element[0]]: [key, element[1], element[2]],
    }),
    {} as AnyObjectSchema
  );

interface XmlObjectSchema {
  elementsSchema: AnyObjectSchema;
  attributesSchema: AnyObjectSchema;
}

function createXmlObjectSchema(objectSchema: AnyObjectSchema): XmlObjectSchema {
  const elementsSchema: AnyObjectSchema = {};
  const attributesSchema: AnyObjectSchema = {};
  for (const key in objectSchema) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
      const element = objectSchema[key];
      const [serializedName, schema, xmlOptions] = element;
      const xmlObjectSchema = xmlOptions?.isAttr
        ? attributesSchema
        : elementsSchema;
      xmlObjectSchema[key] = [
        xmlOptions?.xmlName ?? serializedName,
        schema,
        xmlOptions,
      ];
    }
  }
  return { elementsSchema, attributesSchema };
}

function createReverseXmlObjectSchema(
  xmlObjectSchema: XmlObjectSchema
): XmlObjectSchema {
  return {
    attributesSchema: createReverseObjectSchema(
      xmlObjectSchema.attributesSchema
    ),
    elementsSchema: createReverseObjectSchema(xmlObjectSchema.elementsSchema),
  };
}
