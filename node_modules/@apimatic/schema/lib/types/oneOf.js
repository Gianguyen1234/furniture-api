"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneOf = void 0;
var tslib_1 = require("tslib");
function oneOf(schemas, discriminatorMap, discriminatorField) {
    if (discriminatorMap && discriminatorField) {
        return createOneOfWithDiscriminator(schemas, discriminatorMap, discriminatorField);
    }
    else {
        return createOneOfWithoutDiscriminator(schemas);
    }
}
exports.oneOf = oneOf;
function createOneOfWithDiscriminator(schemas, discriminatorMap, discriminatorField) {
    return {
        type: function () { return "OneOf<".concat(schemas.map(function (schema) { return schema.type(); }).join(' | '), ">"); },
        validateBeforeMap: function (value, ctxt) {
            var discriminatorValue = value && typeof value === 'object' && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].validateBeforeMap(value, ctxt);
            }
            return matchAndValidateBeforeMap(schemas, value, ctxt);
        },
        validateBeforeUnmap: function (value, ctxt) {
            var discriminatorValue = value && typeof value === 'object' && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].validateBeforeUnmap(value, ctxt);
            }
            return matchAndValidateBeforeUnmap(schemas, value, ctxt);
        },
        map: function (value, ctxt) {
            var discriminatorValue = value && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].map(value, ctxt);
            }
            return matchAndMap(schemas, value, ctxt);
        },
        unmap: function (value, ctxt) {
            var discriminatorValue = value && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].unmap(value, ctxt);
            }
            return matchAndUnmap(schemas, value, ctxt);
        },
        validateBeforeMapXml: function (value, ctxt) {
            var discriminatorValue = value && typeof value === 'object' && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].validateBeforeMapXml(value, ctxt);
            }
            return matchAndValidateBeforeMapXml(schemas, value, ctxt);
        },
        mapXml: function (value, ctxt) {
            var discriminatorValue = value && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].mapXml(value, ctxt);
            }
            return matchAndMapXml(schemas, value, ctxt);
        },
        unmapXml: function (value, ctxt) {
            var discriminatorValue = value && value[discriminatorField];
            if (discriminatorValue && discriminatorMap[discriminatorValue]) {
                return discriminatorMap[discriminatorValue].unmapXml(value, ctxt);
            }
            return matchAndUnmapXml(schemas, value, ctxt);
        },
    };
}
function createOneOfWithoutDiscriminator(schemas) {
    return {
        type: function () { return "OneOf<".concat(schemas.map(function (schema) { return schema.type(); }).join(' | '), ">"); },
        validateBeforeMap: function (value, ctxt) {
            return matchAndValidateBeforeMap(schemas, value, ctxt);
        },
        validateBeforeUnmap: function (value, ctxt) {
            return matchAndValidateBeforeUnmap(schemas, value, ctxt);
        },
        map: function (value, ctxt) { return matchAndMap(schemas, value, ctxt); },
        unmap: function (value, ctxt) { return matchAndUnmap(schemas, value, ctxt); },
        validateBeforeMapXml: function (value, ctxt) {
            return matchAndValidateBeforeMapXml(schemas, value, ctxt);
        },
        mapXml: function (value, ctxt) { return matchAndMapXml(schemas, value, ctxt); },
        unmapXml: function (value, ctxt) { return matchAndUnmapXml(schemas, value, ctxt); },
    };
}
function matchAndValidateBeforeMap(schemas, value, ctxt) {
    var e_1, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_1 = tslib_1.__values(schemas), schemas_1_1 = schemas_1.next(); !schemas_1_1.done; schemas_1_1 = schemas_1.next()) {
            var schema = schemas_1_1.value;
            var validationErrors = schema.validateBeforeMap(value, ctxt);
            if (validationErrors.length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (schemas_1_1 && !schemas_1_1.done && (_a = schemas_1.return)) _a.call(schemas_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return validateSchemas(matchedSchemas, ctxt);
}
function matchAndValidateBeforeUnmap(schemas, value, ctxt) {
    var e_2, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_2 = tslib_1.__values(schemas), schemas_2_1 = schemas_2.next(); !schemas_2_1.done; schemas_2_1 = schemas_2.next()) {
            var schema = schemas_2_1.value;
            var validationErrors = schema.validateBeforeUnmap(value, ctxt);
            if (validationErrors.length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (schemas_2_1 && !schemas_2_1.done && (_a = schemas_2.return)) _a.call(schemas_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return validateSchemas(matchedSchemas, ctxt);
}
function matchAndValidateBeforeMapXml(schemas, value, ctxt) {
    var e_3, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_3 = tslib_1.__values(schemas), schemas_3_1 = schemas_3.next(); !schemas_3_1.done; schemas_3_1 = schemas_3.next()) {
            var schema = schemas_3_1.value;
            var validationErrors = schema.validateBeforeMapXml(value, ctxt);
            if (validationErrors.length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (schemas_3_1 && !schemas_3_1.done && (_a = schemas_3.return)) _a.call(schemas_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return validateSchemas(matchedSchemas, ctxt);
}
function validateSchemas(schemas, ctxt) {
    if (schemas.length === 1) {
        return [];
    }
    if (schemas.length === 0) {
        return ctxt.fail('Could not match against any acceptable type.');
    }
    return ctxt.fail("Matched more than one type. Matched types include: ".concat(schemas
        .map(function (schema) { return schema.type(); })
        .join(', ')));
}
function matchAndMap(schemas, value, ctxt) {
    var e_4, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_4 = tslib_1.__values(schemas), schemas_4_1 = schemas_4.next(); !schemas_4_1.done; schemas_4_1 = schemas_4.next()) {
            var schema = schemas_4_1.value;
            if (schema.validateBeforeMap(value, ctxt).length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (schemas_4_1 && !schemas_4_1.done && (_a = schemas_4.return)) _a.call(schemas_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return matchedSchemas.length === 1
        ? matchedSchemas[0].map(value, ctxt)
        : undefined;
}
function matchAndUnmap(schemas, value, ctxt) {
    var e_5, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_5 = tslib_1.__values(schemas), schemas_5_1 = schemas_5.next(); !schemas_5_1.done; schemas_5_1 = schemas_5.next()) {
            var schema = schemas_5_1.value;
            if (schema.validateBeforeUnmap(value, ctxt).length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (schemas_5_1 && !schemas_5_1.done && (_a = schemas_5.return)) _a.call(schemas_5);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return matchedSchemas.length === 1
        ? matchedSchemas[0].unmap(value, ctxt)
        : undefined;
}
function matchAndMapXml(schemas, value, ctxt) {
    var e_6, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_6 = tslib_1.__values(schemas), schemas_6_1 = schemas_6.next(); !schemas_6_1.done; schemas_6_1 = schemas_6.next()) {
            var schema = schemas_6_1.value;
            if (schema.validateBeforeMapXml(value, ctxt).length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (schemas_6_1 && !schemas_6_1.done && (_a = schemas_6.return)) _a.call(schemas_6);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return matchedSchemas.length === 1
        ? matchedSchemas[0].mapXml(value, ctxt)
        : undefined;
}
function matchAndUnmapXml(schemas, value, ctxt) {
    var e_7, _a;
    var matchedSchemas = [];
    ctxt.strictValidation = true;
    try {
        for (var schemas_7 = tslib_1.__values(schemas), schemas_7_1 = schemas_7.next(); !schemas_7_1.done; schemas_7_1 = schemas_7.next()) {
            var schema = schemas_7_1.value;
            if (schema.validateBeforeMapXml(value, ctxt).length === 0) {
                matchedSchemas.push(schema);
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (schemas_7_1 && !schemas_7_1.done && (_a = schemas_7.return)) _a.call(schemas_7);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return matchedSchemas.length === 1
        ? matchedSchemas[0].unmapXml(value, ctxt)
        : undefined;
}
