"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = void 0;
var utils_1 = require("../utils");
/**
 * Create an array schema.
 *
 * The array must be a homogenous array confirming to the itemsSchema. Each item
 * will be mapped/unmapped using the itemsSchema.
 */
function array(itemsSchema, xmlOptions) {
    var arraySchema;
    arraySchema = {
        type: function () { return "Array<".concat(itemsSchema.type(), ">"); },
        validateBeforeMap: function (value, ctxt) {
            return Array.isArray(value)
                ? ctxt.flatmapChildren((0, utils_1.arrayEntries)(value), itemsSchema, function (v, childCtxt) { return itemsSchema.validateBeforeMap(v[1], childCtxt); })
                : ctxt.fail();
        },
        validateBeforeUnmap: function (value, ctxt) {
            return Array.isArray(value)
                ? ctxt.flatmapChildren((0, utils_1.arrayEntries)(value), itemsSchema, function (v, childCtxt) { return itemsSchema.validateBeforeUnmap(v[1], childCtxt); })
                : ctxt.fail();
        },
        map: function (value, ctxt) {
            return ctxt.mapChildren((0, utils_1.arrayEntries)(value), itemsSchema, function (v, childCtxt) {
                return itemsSchema.map(v[1], childCtxt);
            });
        },
        unmap: function (value, ctxt) {
            return ctxt.mapChildren((0, utils_1.arrayEntries)(value), itemsSchema, function (v, childCtxt) {
                return itemsSchema.unmap(v[1], childCtxt);
            });
        },
        mapXml: function (value, ctxt) {
            var items = value;
            if (xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlItemName) {
                items = value[xmlOptions.xmlItemName];
                ctxt = ctxt.createChild(xmlOptions.xmlItemName, items, itemsSchema);
            }
            return ctxt.mapChildren((0, utils_1.arrayEntries)(items), itemsSchema, function (v, childCtxt) { return itemsSchema.mapXml(v[1], childCtxt); });
        },
        unmapXml: function (value, ctxt) {
            var _a;
            var items = ctxt.mapChildren((0, utils_1.arrayEntries)(value), itemsSchema, function (v, childCtxt) { return itemsSchema.unmapXml(v[1], childCtxt); });
            if (xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlItemName) {
                return _a = {}, _a[xmlOptions.xmlItemName] = items, _a;
            }
            else {
                return items;
            }
        },
        validateBeforeMapXml: function (value, ctxt) {
            var items = value;
            if (xmlOptions === null || xmlOptions === void 0 ? void 0 : xmlOptions.xmlItemName) {
                var errorMessage = "Expected array to be wrapped with XML element ".concat(xmlOptions.xmlItemName, ".");
                if (typeof value !== 'object' ||
                    value === null ||
                    !(xmlOptions.xmlItemName in value)) {
                    return ctxt.fail(errorMessage);
                }
                items = value[xmlOptions.xmlItemName];
                ctxt = ctxt.createChild(xmlOptions.xmlItemName, items, itemsSchema);
            }
            return Array.isArray(items)
                ? ctxt.flatmapChildren((0, utils_1.arrayEntries)(items), itemsSchema, function (v, childCtxt) { return itemsSchema.validateBeforeMapXml(v[1], childCtxt); })
                : ctxt.fail();
        },
    };
    return arraySchema;
}
exports.array = array;
