"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendObject = exports.extendExpandoObject = exports.extendStrictObject = exports.object = exports.typedExpandoObject = exports.expandoObject = exports.strictObject = void 0;
var tslib_1 = require("tslib");
var schema_1 = require("../schema");
var utils_1 = require("../utils");
var dict_1 = require("./dict");
var optional_1 = require("./optional");
/**
 * Create a Strict Object type schema.
 *
 * A strict-object does not allow additional properties during mapping or
 * unmapping. Additional properties will result in a validation error.
 */
function strictObject(objectSchema) {
    var schema = internalObject(objectSchema, false, false);
    schema.type = function () {
        return "StrictObject<{".concat(Object.keys(objectSchema)
            .map(utils_1.objectKeyEncode)
            .join(','), "}>");
    };
    return schema;
}
exports.strictObject = strictObject;
/**
 * Create an Expandable Object type schema, allowing all additional properties.
 *
 * The object schema allows additional properties during mapping and unmapping. The
 * additional properties are copied over as is.
 */
function expandoObject(objectSchema) {
    return internalObject(objectSchema, true, true);
}
exports.expandoObject = expandoObject;
/**
 * Create an Expandable Object type schema, allowing only typed additional properties.
 *
 * The object schema allows additional properties during mapping and unmapping. The
 * additional properties are copied over in a Record<string, SchemaType<S>>
 * with key represented by K.
 */
function typedExpandoObject(objectSchema, additionalPropertyKey, additionalPropertySchema) {
    return internalObject(objectSchema, true, [
        additionalPropertyKey,
        (0, optional_1.optional)((0, dict_1.dict)(additionalPropertySchema)),
    ]);
}
exports.typedExpandoObject = typedExpandoObject;
/**
 * Create an Object Type schema.
 *
 * The Object schema allows additional properties during mapping and unmapping
 * but discards them.
 */
function object(objectSchema) {
    var schema = internalObject(objectSchema, true, false);
    schema.type = function () {
        return "Object<{".concat(Object.keys(objectSchema).map(utils_1.objectKeyEncode).join(','), "}>");
    };
    return schema;
}
exports.object = object;
/**
 * Create a strict-object schema that extends an existing schema.
 */
function extendStrictObject(parentObjectSchema, objectSchema) {
    return strictObject(tslib_1.__assign(tslib_1.__assign({}, parentObjectSchema.objectSchema), objectSchema));
}
exports.extendStrictObject = extendStrictObject;
/**
 * Create an object schema that extends an existing schema.
 */
function extendExpandoObject(parentObjectSchema, objectSchema) {
    return expandoObject(tslib_1.__assign(tslib_1.__assign({}, parentObjectSchema.objectSchema), objectSchema));
}
exports.extendExpandoObject = extendExpandoObject;
/**
 * Create an Object schema that extends an existing object schema.
 */
function extendObject(parentObjectSchema, objectSchema) {
    return object(tslib_1.__assign(tslib_1.__assign({}, parentObjectSchema.objectSchema), objectSchema));
}
exports.extendObject = extendObject;
/**
 * Internal utility to create object schema with different options.
 */
function internalObject(objectSchema, skipAdditionalPropValidation, mapAdditionalProps) {
    var keys = Object.keys(objectSchema);
    var reverseObjectSchema = createReverseObjectSchema(objectSchema);
    var xmlMappingInfo = getXmlPropMappingForObjectSchema(objectSchema);
    var xmlObjectSchema = createXmlObjectSchema(objectSchema);
    var reverseXmlObjectSchema = createReverseXmlObjectSchema(xmlObjectSchema);
    return {
        type: function () { return "Object<{".concat(keys.map(utils_1.objectKeyEncode).join(','), ",...}>"); },
        validateBeforeMap: validateObject(objectSchema, 'validateBeforeMap', skipAdditionalPropValidation, mapAdditionalProps),
        validateBeforeUnmap: validateObject(reverseObjectSchema, 'validateBeforeUnmap', skipAdditionalPropValidation, mapAdditionalProps),
        map: mapObject(objectSchema, 'map', mapAdditionalProps),
        unmap: mapObject(reverseObjectSchema, 'unmap', mapAdditionalProps),
        validateBeforeMapXml: validateObjectBeforeMapXml(objectSchema, xmlMappingInfo, skipAdditionalPropValidation, mapAdditionalProps),
        mapXml: mapObjectFromXml(xmlObjectSchema, mapAdditionalProps),
        unmapXml: unmapObjectToXml(reverseXmlObjectSchema, mapAdditionalProps),
        objectSchema: objectSchema,
    };
}
function validateObjectBeforeMapXml(objectSchema, xmlMappingInfo, skipAdditionalPropValidation, mapAdditionalProps) {
    var elementsToProps = xmlMappingInfo.elementsToProps, attributesToProps = xmlMappingInfo.attributesToProps;
    return function (value, ctxt) {
        if (typeof value !== 'object' || value === null) {
            return ctxt.fail();
        }
        if (Array.isArray(value)) {
            return ctxt.fail("Expected value to be of type '".concat(ctxt.type, "' but found 'Array<").concat(typeof value, ">'."));
        }
        var valueObject = value;
        var attrs = valueObject.$, elements = tslib_1.__rest(valueObject, ["$"]);
        var validationObj = {
            validationMethod: 'validateBeforeMapXml',
            propTypeName: 'child elements',
            propTypePrefix: 'element',
            valueTypeName: 'element',
            propMapping: elementsToProps,
            objectSchema: objectSchema,
            valueObject: elements,
            ctxt: ctxt,
            skipAdditionalPropValidation: skipAdditionalPropValidation,
            mapAdditionalProps: mapAdditionalProps,
        };
        // Validate all known elements using the schema
        var elementErrors = validateValueObject(validationObj);
        validationObj = tslib_1.__assign(tslib_1.__assign({}, validationObj), { propTypeName: 'attributes', propTypePrefix: '@', propMapping: attributesToProps, valueObject: attrs !== null && attrs !== void 0 ? attrs : {} });
        // Validate all known attributes using the schema
        var attributesErrors = validateValueObject(validationObj);
        return elementErrors.concat(attributesErrors);
    };
}
function mapObjectFromXml(xmlObjectSchema, mapAdditionalProps) {
    var elementsSchema = xmlObjectSchema.elementsSchema, attributesSchema = xmlObjectSchema.attributesSchema;
    var mapElements = mapObject(elementsSchema, 'mapXml', mapAdditionalProps);
    var mapAttributes = mapObject(attributesSchema, 'mapXml', false // Always false; additional attributes are handled differently below.
    );
    // These are later used to omit know attribute props from the attributes object
    // so that the remaining props can be copied over as additional props.
    var attributeKeys = (0, utils_1.objectEntries)(attributesSchema).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), _ = _b[0], _c = tslib_1.__read(_b[1], 1), name = _c[0];
        return name;
    });
    return function (value, ctxt) {
        var valueObject = value;
        var attrs = valueObject.$, elements = tslib_1.__rest(valueObject, ["$"]);
        var attributes = attrs !== null && attrs !== void 0 ? attrs : {};
        var output = tslib_1.__assign(tslib_1.__assign({}, mapAttributes(attributes, ctxt)), mapElements(elements, ctxt));
        if (mapAdditionalProps) {
            // Omit known attributes and copy the rest as additional attributes.
            var additionalAttrs = (0, utils_1.omitKeysFromObject)(attributes, attributeKeys);
            if (Object.keys(additionalAttrs).length > 0) {
                // These additional attrs are set in the '$' property by convention.
                output.$ = additionalAttrs;
            }
        }
        return output;
    };
}
function unmapObjectToXml(xmlObjectSchema, mapAdditionalProps) {
    var elementsSchema = xmlObjectSchema.elementsSchema, attributesSchema = xmlObjectSchema.attributesSchema;
    var mapElements = mapObject(elementsSchema, 'unmapXml', mapAdditionalProps);
    var mapAttributes = mapObject(attributesSchema, 'unmapXml', false // Always false so that element props are not copied during mapping
    );
    // These are later used to omit attribute props from the value object so that they
    // do not get mapped during element mapping, if the mapAdditionalProps is set.
    var attributeKeys = (0, utils_1.objectEntries)(attributesSchema).map(function (_a) {
        var _b = tslib_1.__read(_a, 2), _ = _b[0], _c = tslib_1.__read(_b[1], 1), name = _c[0];
        return name;
    });
    return function (value, ctxt) {
        // Get additional attributes which are set in the '$' property by convention
        var _a = value, attributes = _a.$, rest = tslib_1.__rest(_a, ["$"]);
        // Ensure 'attributes' is an object and non-null
        var additionalAttributes = typeof attributes === 'object' &&
            attributes !== null &&
            mapAdditionalProps
            ? attributes
            : {};
        return tslib_1.__assign(tslib_1.__assign({}, mapElements((0, utils_1.omitKeysFromObject)(rest, attributeKeys), ctxt)), { $: tslib_1.__assign(tslib_1.__assign({}, additionalAttributes), mapAttributes(value, ctxt)) });
    };
}
function validateValueObject(_a) {
    var e_1, _b;
    var validationMethod = _a.validationMethod, propTypeName = _a.propTypeName, propTypePrefix = _a.propTypePrefix, valueTypeName = _a.valueTypeName, propMapping = _a.propMapping, objectSchema = _a.objectSchema, valueObject = _a.valueObject, ctxt = _a.ctxt, skipAdditionalPropValidation = _a.skipAdditionalPropValidation, mapAdditionalProps = _a.mapAdditionalProps;
    var errors = [];
    var missingProps = new Set();
    var conflictingProps = new Set();
    var unknownProps = new Set(Object.keys(valueObject));
    if (validationMethod !== 'validateBeforeMap' &&
        typeof mapAdditionalProps !== 'boolean' &&
        mapAdditionalProps[0] in valueObject) {
        try {
            for (var _c = tslib_1.__values(Object.entries(valueObject[mapAdditionalProps[0]])), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = tslib_1.__read(_d.value, 2), key = _e[0], _1 = _e[1];
                if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
                    conflictingProps.add(key);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // Create validation errors for conflicting additional properties keys
    addErrorsIfAny(conflictingProps, function (names) {
        return createErrorMessage("Some keys in additional properties are conflicting with the keys in", valueTypeName, names);
    }, errors, ctxt);
    // Validate all known properties using the schema
    for (var key in propMapping) {
        if (Object.prototype.hasOwnProperty.call(propMapping, key)) {
            var propName = propMapping[key];
            var schema = objectSchema[propName][1];
            unknownProps.delete(key);
            if (key in valueObject) {
                schema[validationMethod](valueObject[key], ctxt.createChild(propTypePrefix + key, valueObject[key], schema)).forEach(function (e) { return errors.push(e); });
            }
            else if (!(0, utils_1.isOptionalOrNullableType)(schema.type())) {
                // Add to missing keys if it is not an optional property
                missingProps.add(key);
            }
        }
    }
    // Create validation error for unknown properties encountered
    if (!skipAdditionalPropValidation) {
        addErrorsIfAny(unknownProps, function (names) {
            return createErrorMessage("Some unknown ".concat(propTypeName, " were found in the"), valueTypeName, names);
        }, errors, ctxt);
    }
    // Create validation error for missing required properties
    addErrorsIfAny(missingProps, function (names) {
        return createErrorMessage("Some ".concat(propTypeName, " are missing in the"), valueTypeName, names);
    }, errors, ctxt);
    return errors;
}
function createErrorMessage(message, type, properties) {
    return "".concat(message, " ").concat(type, ": ").concat(properties.map(utils_1.literalToString).join(', '), ".");
}
function addErrorsIfAny(conflictingProps, messageGetter, errors, ctxt) {
    var conflictingPropsArray = Array.from(conflictingProps);
    if (conflictingPropsArray.length > 0) {
        var message = messageGetter(conflictingPropsArray);
        ctxt.fail(message).forEach(function (e) { return errors.push(e); });
    }
}
function validateObject(objectSchema, validationMethod, skipAdditionalPropValidation, mapAdditionalProps) {
    var propMapping = getPropMappingForObjectSchema(objectSchema);
    return function (value, ctxt) {
        if (typeof value !== 'object' || value === null) {
            return ctxt.fail();
        }
        if (Array.isArray(value)) {
            return ctxt.fail("Expected value to be of type '".concat(ctxt.type, "' but found 'Array<").concat(typeof value, ">'."));
        }
        return validateValueObject({
            validationMethod: validationMethod,
            propTypeName: 'properties',
            propTypePrefix: '',
            valueTypeName: 'object',
            propMapping: propMapping,
            objectSchema: objectSchema,
            valueObject: value,
            ctxt: ctxt,
            skipAdditionalPropValidation: skipAdditionalPropValidation,
            mapAdditionalProps: mapAdditionalProps,
        });
    };
}
function mapObject(objectSchema, mappingFn, mapAdditionalProps) {
    return function (value, ctxt) {
        var output = {};
        var objectValue = tslib_1.__assign({}, value);
        var isUnmaping = mappingFn === 'unmap' || mappingFn === 'unmapXml';
        if (isUnmaping &&
            typeof mapAdditionalProps !== 'boolean' &&
            mapAdditionalProps[0] in objectValue) {
            // Pre process to flatten additional properties in objectValue
            Object.entries(objectValue[mapAdditionalProps[0]]).forEach(function (_a) {
                var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
                return (objectValue[k] = v);
            });
            delete objectValue[mapAdditionalProps[0]];
        }
        // Map known properties to output using the schema
        Object.entries(objectSchema).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), key = _b[0], element = _b[1];
            var propName = element[0];
            var propValue = objectValue[propName];
            delete objectValue[propName];
            if ((0, utils_1.isOptionalNullable)(element[1].type(), propValue)) {
                if (typeof propValue === 'undefined') {
                    // Skip mapping to avoid creating properties with value 'undefined'
                    return;
                }
                output[key] = null;
                return;
            }
            if ((0, utils_1.isOptional)(element[1].type(), propValue)) {
                // Skip mapping to avoid creating properties with value 'undefined'
                return;
            }
            output[key] = element[1][mappingFn](propValue, ctxt.createChild(propName, propValue, element[1]));
        });
        // Copy the additional unknown properties in output when allowed
        Object.entries(extractAdditionalProperties(objectValue, isUnmaping, mapAdditionalProps)).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
            return (output[k] = v);
        });
        return output;
    };
}
function extractAdditionalProperties(objectValue, isUnmaping, mapAdditionalProps) {
    var _a;
    var properties = {};
    if (!mapAdditionalProps) {
        return properties;
    }
    if (typeof mapAdditionalProps === 'boolean') {
        Object.entries(objectValue).forEach(function (_a) {
            var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
            return (properties[k] = v);
        });
        return properties;
    }
    Object.entries(objectValue).forEach(function (_a) {
        var _b;
        var _c = tslib_1.__read(_a, 2), k = _c[0], v = _c[1];
        var testValue = (_b = {}, _b[k] = v, _b);
        var mappingResult = isUnmaping
            ? (0, schema_1.validateAndUnmap)(testValue, mapAdditionalProps[1])
            : (0, schema_1.validateAndMap)(testValue, mapAdditionalProps[1]);
        if (mappingResult.errors) {
            return;
        }
        properties[k] = mappingResult.result[k];
    });
    if (isUnmaping || Object.entries(properties).length === 0) {
        return properties;
    }
    return _a = {}, _a[mapAdditionalProps[0]] = properties, _a;
}
function getXmlPropMappingForObjectSchema(objectSchema) {
    var _a, _b;
    var elementsToProps = {};
    var attributesToProps = {};
    for (var key in objectSchema) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
            var _c = tslib_1.__read(objectSchema[key], 3), propName = _c[0], xmlOptions = _c[2];
            if ((xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.isAttr) === true) {
                attributesToProps[(_a = xmlOptions.xmlName) !== null && _a !== void 0 ? _a : propName] = key;
            }
            else {
                elementsToProps[(_b = xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlName) !== null && _b !== void 0 ? _b : propName] = key;
            }
        }
    }
    return { elementsToProps: elementsToProps, attributesToProps: attributesToProps };
}
function getPropMappingForObjectSchema(objectSchema) {
    var propsMapping = {};
    for (var key in objectSchema) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
            var propDef = objectSchema[key];
            propsMapping[propDef[0]] = key;
        }
    }
    return propsMapping;
}
var createReverseObjectSchema = function (objectSchema) {
    return Object.entries(objectSchema).reduce(function (result, _a) {
        var _b;
        var _c = tslib_1.__read(_a, 2), key = _c[0], element = _c[1];
        return (tslib_1.__assign(tslib_1.__assign({}, result), (_b = {}, _b[element[0]] = [key, element[1], element[2]], _b)));
    }, {});
};
function createXmlObjectSchema(objectSchema) {
    var _a;
    var elementsSchema = {};
    var attributesSchema = {};
    for (var key in objectSchema) {
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(objectSchema, key)) {
            var element = objectSchema[key];
            var _b = tslib_1.__read(element, 3), serializedName = _b[0], schema = _b[1], xmlOptions = _b[2];
            var xmlObjectSchema = (xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.isAttr)
                ? attributesSchema
                : elementsSchema;
            xmlObjectSchema[key] = [
                (_a = xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlName) !== null && _a !== void 0 ? _a : serializedName,
                schema,
                xmlOptions,
            ];
        }
    }
    return { elementsSchema: elementsSchema, attributesSchema: attributesSchema };
}
function createReverseXmlObjectSchema(xmlObjectSchema) {
    return {
        attributesSchema: createReverseObjectSchema(xmlObjectSchema.attributesSchema),
        elementsSchema: createReverseObjectSchema(xmlObjectSchema.elementsSchema),
    };
}
