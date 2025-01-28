"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discriminatedObject = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
function discriminatedObject(discriminatorMappedPropName, discriminatorPropName, discriminatorMap, defaultDiscriminator, xmlOptions) {
    var selectSchemaWithDisc = function (value, discriminatorProp, isAttr) {
        if (typeof value === 'object' &&
            value !== null &&
            ((isAttr && xmlObjectHasAttribute(value, discriminatorProp)) ||
                (!isAttr && discriminatorProp in value))) {
            var discriminatorValue = isAttr
                ? value.$[discriminatorProp]
                : value[discriminatorProp];
            if (typeof discriminatorValue === 'string' &&
                discriminatorValue in discriminatorMap) {
                return discriminatorMap[discriminatorValue];
            }
        }
        return undefined;
    };
    var allSchemas = Object.values(discriminatorMap).reverse();
    var selectSchema = function (value, discriminatorProp, validater, isAttr) {
        var schema = selectSchemaWithDisc(value, discriminatorProp, isAttr);
        if (typeof schema !== 'undefined') {
            return schema;
        }
        // Try checking with discriminator matching
        for (var key in allSchemas) {
            if (validater(allSchemas[key]).length === 0) {
                return allSchemas[key];
            }
        }
        // Fallback to default schema
        return discriminatorMap[defaultDiscriminator];
    };
    var mapJsonSchema = function (value, ctxt) {
        return selectSchema(value, discriminatorPropName, function (schema) {
            return schema.validateBeforeMap(value, ctxt);
        });
    };
    var mapXmlSchema = function (value, ctxt) {
        var _a;
        return selectSchema(value, (_a = xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlName) !== null && _a !== void 0 ? _a : discriminatorPropName, function (schema) { return schema.validateBeforeMapXml(value, ctxt); }, xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.isAttr);
    };
    var unmapSchema = function (value, ctxt) {
        return selectSchema(value, discriminatorMappedPropName, function (schema) {
            return schema.validateBeforeUnmap(value, ctxt);
        });
    };
    return {
        type: function () {
            return "DiscriminatedUnion<".concat(discriminatorPropName, ",[").concat((0, utils_1.objectEntries)(discriminatorMap)
                .map(function (_a) {
                var _b = tslib_1.__read(_a, 2), _ = _b[0], v = _b[1];
                return v.type;
            })
                .join(','), "]>");
        },
        map: function (value, ctxt) { return mapJsonSchema(value, ctxt).map(value, ctxt); },
        unmap: function (value, ctxt) { return unmapSchema(value, ctxt).unmap(value, ctxt); },
        validateBeforeMap: function (value, ctxt) {
            return mapJsonSchema(value, ctxt).validateBeforeMap(value, ctxt);
        },
        validateBeforeUnmap: function (value, ctxt) {
            return unmapSchema(value, ctxt).validateBeforeUnmap(value, ctxt);
        },
        mapXml: function (value, ctxt) { return mapXmlSchema(value, ctxt).mapXml(value, ctxt); },
        unmapXml: function (value, ctxt) { return unmapSchema(value, ctxt).unmapXml(value, ctxt); },
        validateBeforeMapXml: function (value, ctxt) {
            return mapXmlSchema(value, ctxt).validateBeforeMapXml(value, ctxt);
        },
    };
}
exports.discriminatedObject = discriminatedObject;
function xmlObjectHasAttribute(value, prop) {
    return ('$' in value &&
        typeof value.$ === 'object' &&
        prop in value.$);
}
