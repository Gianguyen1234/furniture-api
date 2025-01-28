import { __values } from 'tslib';

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
    if (Object.prototype.hasOwnProperty.call(obj, p) && prop === p.toLowerCase()) {
      return p;
    }
  }
  return null;
}
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
    for (var _c = __values(Object.getOwnPropertyNames(headers)), _d = _c.next(); !_d.done; _d = _c.next()) {
      var headerName = _d.value;
      headerKeys[headerName.toLowerCase()] = headerName;
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  try {
    // Override headers with new values
    for (var _e = __values(Object.getOwnPropertyNames(headersToMerge)), _f = _e.next(); !_f.done; _f = _e.next()) {
      var headerName = _f.value;
      var lowerCasedName = headerName.toLowerCase();
      if (headerKeys[lowerCasedName]) {
        delete headers[headerKeys[lowerCasedName]];
      }
      headerKeys[lowerCasedName] = headerName;
      headers[headerName] = headersToMerge[headerName];
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
    } finally {
      if (e_2) throw e_2.error;
    }
  }
}
/**
 * Assert headers object is valid
 */
function assertHeaders(headers) {
  var e_3, _a;
  if (headers === null || typeof headers !== 'object') {
    throw new TypeError('Headers must be an object.');
  }
  try {
    for (var _b = __values(Object.getOwnPropertyNames(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var headerName = _c.value;
      if (!isValidHeaderName(headerName)) {
        throw new Error("\"".concat(headerName, "\" is not a valid header name."));
      }
      var headerValue = headers[headerName];
      if (typeof headerValue !== 'string') {
        throw new TypeError("Header value must be string but ".concat(typeof headerValue, " provided."));
      }
    }
  } catch (e_3_1) {
    e_3 = {
      error: e_3_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_3) throw e_3.error;
    }
  }
}
/**
 * Return true if header name is valid
 * @param headerName Header name
 */
function isValidHeaderName(headerName) {
  return /^[\w!#$%&'*+.^`|~-]+$/.test(headerName);
}
var CONTENT_TYPE_HEADER = 'content-type';
var ACCEPT_HEADER = 'accept';
var CONTENT_LENGTH_HEADER = 'content-length';
var AUTHORIZATION_HEADER = 'authorization';
var FORM_URLENCODED_CONTENT_TYPE = 'application/x-www-form-urlencoded';
var JSON_CONTENT_TYPE = 'application/json';
var TEXT_CONTENT_TYPE = 'text/plain; charset=utf-8';
var XML_CONTENT_TYPE = 'application/xml';
export { ACCEPT_HEADER, AUTHORIZATION_HEADER, CONTENT_LENGTH_HEADER, CONTENT_TYPE_HEADER, FORM_URLENCODED_CONTENT_TYPE, JSON_CONTENT_TYPE, TEXT_CONTENT_TYPE, XML_CONTENT_TYPE, assertHeaders, getHeader, isValidHeaderName, lookupCaseInsensitive, mergeHeaders, setHeader, setHeaderIfNotSet };