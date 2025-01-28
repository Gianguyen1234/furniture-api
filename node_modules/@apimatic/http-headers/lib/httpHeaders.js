"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XML_CONTENT_TYPE = exports.TEXT_CONTENT_TYPE = exports.JSON_CONTENT_TYPE = exports.FORM_URLENCODED_CONTENT_TYPE = exports.AUTHORIZATION_HEADER = exports.CONTENT_LENGTH_HEADER = exports.ACCEPT_HEADER = exports.CONTENT_TYPE_HEADER = exports.isValidHeaderName = exports.assertHeaders = exports.mergeHeaders = exports.lookupCaseInsensitive = exports.getHeader = exports.setHeaderIfNotSet = exports.setHeader = void 0;
var tslib_1 = require("tslib");
/**
 * Set a header in the headers map.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 * @param value Header value
 */
function setHeader(headers, name, value) {
    var realHeaderName = lookupCaseInsensitive(headers, name);
    setHeaderInternal(headers, realHeaderName, name, value);
}
exports.setHeader = setHeader;
function setHeaderInternal(headers, realHeaderName, name, value) {
    if (realHeaderName) {
        delete headers[realHeaderName];
    }
    if (value) {
        headers[name] = value;
    }
}
/**
 * Set a header in the headers map if it is not already set.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 * @param value Header value
 */
function setHeaderIfNotSet(headers, name, value) {
    var realHeaderName = lookupCaseInsensitive(headers, name);
    if (!realHeaderName) {
        setHeaderInternal(headers, realHeaderName, name, value);
    }
}
exports.setHeaderIfNotSet = setHeaderIfNotSet;
/**
 * Get header from a map of headers.
 *
 * This method performs case-insensitive handling of header names.
 *
 * @param headers Map of headers
 * @param name Header name
 */
function getHeader(headers, name) {
    var prop = lookupCaseInsensitive(headers, name);
    if (prop) {
        return headers[prop];
    }
    return null;
}
exports.getHeader = getHeader;
/**
 * Looks up and returns the matching property name from the object.
 *
 * This method returns the matching property name in the object which might or might
 * not have the same case as the prop argument.
 *
 * @param obj Object with string property names
 * @param prop Property to lookup
 */
function lookupCaseInsensitive(obj, prop) {
    prop = prop.toLowerCase();
    for (var p in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, p) &&
            prop === p.toLowerCase()) {
            return p;
        }
    }
    return null;
}
exports.lookupCaseInsensitive = lookupCaseInsensitive;
/**
 * Merge headers
 *
 * Header names are compared using case-insensitive comparison. This method
 * preserves the original header name. If the headersToMerge overrides an existing
 * header, then the new header name (with its casing) is used.
 *
 * @param headers Headers to merge into
 * @param headersToMerge Headers to set
 */
function mergeHeaders(headers, headersToMerge) {
    var e_1, _a, e_2, _b;
    var headerKeys = {};
    try {
        // Create a map of lower-cased-header-name to original-header-names
        for (var _c = tslib_1.__values(Object.getOwnPropertyNames(headers)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var headerName = _d.value;
            headerKeys[headerName.toLowerCase()] = headerName;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        // Override headers with new values
        for (var _e = tslib_1.__values(Object.getOwnPropertyNames(headersToMerge)), _f = _e.next(); !_f.done; _f = _e.next()) {
            var headerName = _f.value;
            var lowerCasedName = headerName.toLowerCase();
            if (headerKeys[lowerCasedName]) {
                delete headers[headerKeys[lowerCasedName]];
            }
            headerKeys[lowerCasedName] = headerName;
            headers[headerName] = headersToMerge[headerName];
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
exports.mergeHeaders = mergeHeaders;
/**
 * Assert headers object is valid
 */
function assertHeaders(headers) {
    var e_3, _a;
    if (headers === null || typeof headers !== 'object') {
        throw new TypeError('Headers must be an object.');
    }
    try {
        for (var _b = tslib_1.__values(Object.getOwnPropertyNames(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var headerName = _c.value;
            if (!isValidHeaderName(headerName)) {
                throw new Error("\"".concat(headerName, "\" is not a valid header name."));
            }
            var headerValue = headers[headerName];
            if (typeof headerValue !== 'string') {
                throw new TypeError("Header value must be string but ".concat(typeof headerValue, " provided."));
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
exports.assertHeaders = assertHeaders;
/**
 * Return true if header name is valid
 * @param headerName Header name
 */
function isValidHeaderName(headerName) {
    return /^[\w!#$%&'*+.^`|~-]+$/.test(headerName);
}
exports.isValidHeaderName = isValidHeaderName;
exports.CONTENT_TYPE_HEADER = 'content-type';
exports.ACCEPT_HEADER = 'accept';
exports.CONTENT_LENGTH_HEADER = 'content-length';
exports.AUTHORIZATION_HEADER = 'authorization';
exports.FORM_URLENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
exports.JSON_CONTENT_TYPE = 'application/json';
exports.TEXT_CONTENT_TYPE = 'text/plain; charset=utf-8';
exports.XML_CONTENT_TYPE = 'application/xml';
