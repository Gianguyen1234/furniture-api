"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathTemplate = exports.SkipEncode = void 0;
var tslib_1 = require("tslib");
var lodash_flatmap_1 = tslib_1.__importDefault(require("lodash.flatmap"));
/** Marker for skipping URL-encoding when used with Path templating */
var SkipEncode = /** @class */ (function () {
    function SkipEncode(value) {
        this.value = value;
    }
    return SkipEncode;
}());
exports.SkipEncode = SkipEncode;
/**
 * URL path templating method.
 *
 * Template arguments of array type are imploded using the path separator and
 * individual elements are URL-encoded.
 *
 * Template arguments are URL-encoded unless wrapped in a SkipEncode instance.
 */
function pathTemplate(strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var values = (0, lodash_flatmap_1.default)(interweaveArrays(strings.map(function (s) { return new SkipEncode(s); }), args), encodePathTemplateSegment);
    var pathSegment = values.join('');
    return pathSegment;
}
exports.pathTemplate = pathTemplate;
function encodePathTemplateSegment(value) {
    var skipEncode = false;
    var encode = function (m) {
        var encodeParameter = '';
        if (typeof m === 'string' ||
            typeof m === 'number' ||
            typeof m === 'bigint') {
            encodeParameter =
                skipEncode || typeof m === 'bigint'
                    ? m.toString()
                    : encodeURIComponent(m);
        }
        return encodeParameter;
    };
    if (value instanceof SkipEncode) {
        value = value.value;
        skipEncode = true;
    }
    return Array.isArray(value)
        ? value
            .map(encode)
            .join('/')
        : [encode(value)];
}
function interweaveArrays(a, b) {
    var min = Math.min(a.length, b.length);
    return Array.apply(null, new Array(min))
        .reduce(function (result, _, index) {
        result.push(a[index], b[index]);
        return result;
    }, [])
        .concat((a.length > min ? a : b).slice(min));
}
