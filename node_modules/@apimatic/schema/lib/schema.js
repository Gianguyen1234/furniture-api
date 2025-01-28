"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndUnmapXml = exports.validateAndMapXml = exports.validateAndUnmap = exports.validateAndMap = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
/**
 * Validate and map the value using the given schema.
 *
 * This method should be used after JSON deserialization.
 *
 * @param value Value to map
 * @param schema Schema for type
 */
function validateAndMap(value, schema) {
    var contextCreator = createSchemaContextCreator(createNewSchemaContext(value, schema.type()));
    var validationResult = schema.validateBeforeMap(value, contextCreator);
    if (validationResult.length === 0) {
        if ((0, utils_1.isOptionalNullable)(schema.type(), value)) {
            return { errors: false, result: value };
        }
        return { errors: false, result: schema.map(value, contextCreator) };
    }
    else {
        return { errors: validationResult };
    }
}
exports.validateAndMap = validateAndMap;
/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before JSON serializatin.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
function validateAndUnmap(value, schema) {
    var contextCreator = createSchemaContextCreator(createNewSchemaContext(value, schema.type()));
    var validationResult = schema.validateBeforeUnmap(value, contextCreator);
    if (validationResult.length === 0) {
        return { errors: false, result: schema.unmap(value, contextCreator) };
    }
    else {
        return { errors: validationResult };
    }
}
exports.validateAndUnmap = validateAndUnmap;
/**
 * Validate and map the value using the given schema.
 *
 * This method should be used after XML deserialization.
 *
 * @param value Value to map
 * @param schema Schema for type
 */
function validateAndMapXml(value, schema) {
    var contextCreator = createSchemaContextCreator(createNewSchemaContext(value, schema.type()));
    var validationResult = schema.validateBeforeMapXml(value, contextCreator);
    if (validationResult.length === 0) {
        return { errors: false, result: schema.mapXml(value, contextCreator) };
    }
    else {
        return { errors: validationResult };
    }
}
exports.validateAndMapXml = validateAndMapXml;
/**
 * Valudate and unmap the value using the given schema.
 *
 * This method should be used before XML serialization.
 *
 * @param value Value to unmap
 * @param schema Schema for type
 */
function validateAndUnmapXml(value, schema) {
    var contextCreator = createSchemaContextCreator(createNewSchemaContext(value, schema.type()));
    var validationResult = schema.validateBeforeUnmap(value, contextCreator);
    if (validationResult.length === 0) {
        return { errors: false, result: schema.unmapXml(value, contextCreator) };
    }
    else {
        return { errors: validationResult };
    }
}
exports.validateAndUnmapXml = validateAndUnmapXml;
/**
 * Create a new schema context using the given value and type.
 */
function createNewSchemaContext(value, type, strict) {
    return {
        value: value,
        type: type,
        branch: [value],
        path: [],
        strictValidation: strict,
    };
}
/**
 * Create a new SchemaContextCreator for the given SchemaContext.
 */
function createSchemaContextCreator(currentContext) {
    var createChildContext = function (key, value, childSchema) {
        return createSchemaContextCreator({
            value: value,
            type: childSchema.type(),
            branch: currentContext.branch.concat(value),
            path: currentContext.path.concat(key),
            strictValidation: currentContext.strictValidation,
        });
    };
    var mapChildren = function (items, itemSchema, mapper) {
        return items.map(function (item) {
            return mapper(item, createChildContext(item[0], item[1], itemSchema));
        });
    };
    return tslib_1.__assign(tslib_1.__assign({}, currentContext), { createChild: createChildContext, flatmapChildren: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return flatten(mapChildren.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false)));
        }, mapChildren: mapChildren, fail: function (message) { return [
            {
                value: currentContext.value,
                type: currentContext.type,
                branch: currentContext.branch,
                path: currentContext.path,
                message: createErrorMessage(currentContext, message),
            },
        ]; } });
}
function createErrorMessage(ctxt, message) {
    var giveValue = JSON.stringify(ctxt.value, function (_, value) {
        return typeof value === 'bigint' ? value.toString() : value;
    });
    message =
        (message !== null && message !== void 0 ? message : "Expected value to be of type '".concat(ctxt.type, "' but found '").concat(typeof ctxt.value, "'.")) +
            '\n' +
            "\nGiven value: ".concat(giveValue) +
            "\nType: '".concat(typeof ctxt.value, "'") +
            "\nExpected type: '".concat(ctxt.type, "'");
    if (ctxt.path.length > 0) {
        var pathString = ctxt.path
            .map(function (value) { return (0, utils_1.objectKeyEncode)(value.toString()); })
            .join(' › ');
        message += "\nPath: ".concat(pathString);
    }
    return message;
}
function flatten(array) {
    var e_1, _a, e_2, _b;
    var output = [];
    try {
        for (var array_1 = tslib_1.__values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
            var ele = array_1_1.value;
            try {
                for (var ele_1 = (e_2 = void 0, tslib_1.__values(ele)), ele_1_1 = ele_1.next(); !ele_1_1.done; ele_1_1 = ele_1.next()) {
                    var x = ele_1_1.value;
                    output.push(x);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (ele_1_1 && !ele_1_1.done && (_b = ele_1.return)) _b.call(ele_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
