"use strict";
/**
 * Utilities for internal library usage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOptionalOrNullableType = exports.isOptionalAndNullableType = exports.isOptionalNullable = exports.isOptional = exports.isNullOrMissing = exports.objectKeyEncode = exports.omitKeysFromObject = exports.once = exports.coerceStringOrNumberToBigInt = exports.coerceNumericStringToNumber = exports.isNumericString = exports.createSymmetricSchema = exports.toValidator = exports.identityFn = exports.literalToString = exports.objectEntries = exports.arrayEntries = void 0;
var tslib_1 = require("tslib");
function arrayEntries(arr) {
    var entries = [];
    for (var index = 0; index < arr.length; index++) {
        var element = arr[index];
        entries.push([index, element]);
    }
    return entries;
}
exports.arrayEntries = arrayEntries;
function objectEntries(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i); // preallocate the Array
    while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
}
exports.objectEntries = objectEntries;
function literalToString(value) {
    return typeof value === 'string'
        ? "\"".concat(value.replace(/"/g, '"'), "\"")
        : "".concat(value);
}
exports.literalToString = literalToString;
function identityFn(value) {
    return value;
}
exports.identityFn = identityFn;
function toValidator(fn) {
    return function (value, ctxt) { return (fn(value, ctxt.strictValidation) ? [] : ctxt.fail()); };
}
exports.toValidator = toValidator;
/**
 * Create a schema in which the mapping and unmapping is done the same way
 */
function createSymmetricSchema(schema) {
    return createBasicSchema({
        type: function () { return schema.type; },
        validateBeforeMap: schema.validate,
        validateBeforeUnmap: schema.validate,
        map: schema.map,
        unmap: schema.map,
    });
}
exports.createSymmetricSchema = createSymmetricSchema;
/** Create a basic schema where XML mapping and validation is the same as for JSON */
function createBasicSchema(basicSchema) {
    return tslib_1.__assign(tslib_1.__assign({}, basicSchema), { validateBeforeMapXml: basicSchema.validateBeforeUnmap, mapXml: basicSchema.map, unmapXml: basicSchema.unmap });
}
function isNumericString(value, strict) {
    return strict
        ? typeof value === 'number'
        : typeof value === 'number' ||
            (typeof value === 'string' && !isNaN(value));
}
exports.isNumericString = isNumericString;
function coerceNumericStringToNumber(value) {
    return typeof value === 'number' ? value : +value;
}
exports.coerceNumericStringToNumber = coerceNumericStringToNumber;
function coerceStringOrNumberToBigInt(value) {
    return typeof value === 'bigint' ? value : BigInt(value);
}
exports.coerceStringOrNumberToBigInt = coerceStringOrNumberToBigInt;
function once(func) {
    var ran = false;
    var memo;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (ran) {
            return memo;
        }
        ran = true;
        memo = func.apply(this, args);
        return memo;
    };
}
exports.once = once;
/**
 * Returns a copy of the object with the given keys omitted.
 */
function omitKeysFromObject(object, keysToOmit) {
    var omitSet = new Set(keysToOmit);
    var output = {};
    for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key) &&
            !omitSet.has(key)) {
            output[key] = object[key];
        }
    }
    return output;
}
exports.omitKeysFromObject = omitKeysFromObject;
function objectKeyEncode(key) {
    return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}
exports.objectKeyEncode = objectKeyEncode;
function isNullOrMissing(value) {
    return value === null || typeof value === 'undefined';
}
exports.isNullOrMissing = isNullOrMissing;
function isOptional(type, value) {
    return type.startsWith('Optional<') && typeof value === 'undefined';
}
exports.isOptional = isOptional;
function isOptionalNullable(type, value) {
    return isOptionalAndNullableType(type) && isNullOrMissing(value);
}
exports.isOptionalNullable = isOptionalNullable;
function isOptionalAndNullableType(type) {
    return (type.startsWith('Optional<Nullable<') ||
        type.startsWith('Nullable<Optional<'));
}
exports.isOptionalAndNullableType = isOptionalAndNullableType;
function isOptionalOrNullableType(type) {
    return type.startsWith('Optional<') || type.startsWith('Nullable<');
}
exports.isOptionalOrNullableType = isOptionalOrNullableType;
