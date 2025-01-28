import { __assign } from 'tslib';

/**
 * Utilities for internal library usage
 */
function arrayEntries(arr) {
  var entries = [];
  for (var index = 0; index < arr.length; index++) {
    var element = arr[index];
    entries.push([index, element]);
  }
  return entries;
}
function objectEntries(obj) {
  var ownProps = Object.keys(obj);
  var i = ownProps.length;
  var resArray = new Array(i); // preallocate the Array
  while (i--) {
    resArray[i] = [ownProps[i], obj[ownProps[i]]];
  }
  return resArray;
}
function literalToString(value) {
  return typeof value === 'string' ? "\"".concat(value.replace(/"/g, '"'), "\"") : "".concat(value);
}
function identityFn(value) {
  return value;
}
function toValidator(fn) {
  return function (value, ctxt) {
    return fn(value, ctxt.strictValidation) ? [] : ctxt.fail();
  };
}
/**
 * Create a schema in which the mapping and unmapping is done the same way
 */
function createSymmetricSchema(schema) {
  return createBasicSchema({
    type: function () {
      return schema.type;
    },
    validateBeforeMap: schema.validate,
    validateBeforeUnmap: schema.validate,
    map: schema.map,
    unmap: schema.map
  });
}
/** Create a basic schema where XML mapping and validation is the same as for JSON */
function createBasicSchema(basicSchema) {
  return __assign(__assign({}, basicSchema), {
    validateBeforeMapXml: basicSchema.validateBeforeUnmap,
    mapXml: basicSchema.map,
    unmapXml: basicSchema.unmap
  });
}
function isNumericString(value, strict) {
  return strict ? typeof value === 'number' : typeof value === 'number' || typeof value === 'string' && !isNaN(value);
}
function coerceNumericStringToNumber(value) {
  return typeof value === 'number' ? value : +value;
}
function coerceStringOrNumberToBigInt(value) {
  return typeof value === 'bigint' ? value : BigInt(value);
}
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
/**
 * Returns a copy of the object with the given keys omitted.
 */
function omitKeysFromObject(object, keysToOmit) {
  var omitSet = new Set(keysToOmit);
  var output = {};
  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && !omitSet.has(key)) {
      output[key] = object[key];
    }
  }
  return output;
}
function objectKeyEncode(key) {
  return key.indexOf(' ') !== -1 ? literalToString(key) : key;
}
function isNullOrMissing(value) {
  return value === null || typeof value === 'undefined';
}
function isOptional(type, value) {
  return type.startsWith('Optional<') && typeof value === 'undefined';
}
function isOptionalNullable(type, value) {
  return isOptionalAndNullableType(type) && isNullOrMissing(value);
}
function isOptionalAndNullableType(type) {
  return type.startsWith('Optional<Nullable<') || type.startsWith('Nullable<Optional<');
}
function isOptionalOrNullableType(type) {
  return type.startsWith('Optional<') || type.startsWith('Nullable<');
}
export { arrayEntries, coerceNumericStringToNumber, coerceStringOrNumberToBigInt, createSymmetricSchema, identityFn, isNullOrMissing, isNumericString, isOptional, isOptionalAndNullableType, isOptionalNullable, isOptionalOrNullableType, literalToString, objectEntries, objectKeyEncode, omitKeysFromObject, once, toValidator };