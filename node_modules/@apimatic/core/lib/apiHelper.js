"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateErrorMessage = exports.updateUserAgent = exports.deprecated = exports.sanitizeUrl = void 0;
var tslib_1 = require("tslib");
var http_headers_1 = require("@apimatic/http-headers");
var detect_browser_1 = require("detect-browser");
var tiny_warning_1 = tslib_1.__importDefault(require("tiny-warning"));
var json_ptr_1 = require("json-ptr");
/**
 * Validates the protocol and removes duplicate forward slashes
 *
 * @param url URL to clean
 * @returns Sanitized URL
 */
function sanitizeUrl(url) {
    // ensure that the urls are absolute
    var protocolRegex = /^https?:\/\/[^/]+/;
    var match = url.match(protocolRegex);
    if (match === null) {
        throw new Error("Invalid URL format: ".concat(url));
    }
    // remove redundant double-forward slashes
    var protocol = match[0];
    var queryUrl = url.substring(protocol.length).replace(/\/\/+/g, '/');
    return protocol + queryUrl;
}
exports.sanitizeUrl = sanitizeUrl;
/**
 * Create warning for deprecated method usage.
 *
 * This is called once per deprecated method. If this method is called again
 * with the same arguments, no warning is generated.
 *
 * @param methodName Method name for deprecated method
 * @param notice Optional message for deprecation
 */
function deprecated(methodName, notice) {
    var message = "Method ".concat(methodName, " is deprecated.");
    if (notice) {
        message += " ".concat(notice);
    }
    if (process.env.NODE_ENV !== 'production') {
        (0, tiny_warning_1.default)(false, message);
    }
}
exports.deprecated = deprecated;
/**
 * Replace the templated placeholders in user-agent with the platform
 * related information.
 * @param userAgent User-agent value to be updated
 * @returns Updated user-agent value
 */
function updateUserAgent(userAgent, apiVersion, detail) {
    var updatedAgent = userAgent;
    var result = (0, detect_browser_1.detect)();
    if (result) {
        updatedAgent = updatedAgent.replace('{engine}', result.name);
    }
    if (result === null || result === void 0 ? void 0 : result.version) {
        updatedAgent = updatedAgent.replace('{engine-version}', result.version);
    }
    if (result === null || result === void 0 ? void 0 : result.os) {
        updatedAgent = updatedAgent.replace('{os-info}', result.os);
    }
    if (typeof apiVersion !== 'undefined') {
        updatedAgent = updatedAgent.replace('{api-version}', apiVersion);
    }
    if (typeof detail !== 'undefined') {
        assertUserAgentDetail(detail);
        updatedAgent = updatedAgent.replace('{detail}', encodeURIComponent(detail));
    }
    return updatedAgent;
}
exports.updateUserAgent = updateUserAgent;
function assertUserAgentDetail(detail) {
    if (detail.length > 128) {
        throw new Error('userAgentDetail length exceeds 128 characters limit');
    }
}
/**
 * Replace the templated placeholders in error with the platform
 * related information.
 * @param message message value to be updated
 * @returns Updated message value
 */
function updateErrorMessage(message, response) {
    var placeholders = message.match(/\{\$.*?\}/g);
    var statusCodePlaceholder = placeholders === null || placeholders === void 0 ? void 0 : placeholders.includes('{$statusCode}');
    var headerPlaceholders = placeholders === null || placeholders === void 0 ? void 0 : placeholders.filter(function (value) {
        return value.startsWith('{$response.header');
    });
    var bodyPlaceholders = placeholders === null || placeholders === void 0 ? void 0 : placeholders.filter(function (value) {
        return value.startsWith('{$response.body');
    });
    message = replaceStatusCodePlaceholder(message, response.statusCode, statusCodePlaceholder);
    message = replaceHeaderPlaceholders(message, response.headers, headerPlaceholders);
    if (typeof response.body === 'string') {
        message = replaceBodyPlaceholders(message, response.body, bodyPlaceholders);
    }
    return message;
}
exports.updateErrorMessage = updateErrorMessage;
function replaceStatusCodePlaceholder(message, statusCode, statusCodePlaceholder) {
    if (statusCodePlaceholder) {
        return message.replace('{$statusCode}', statusCode.toString());
    }
    return message;
}
function replaceHeaderPlaceholders(message, headers, headerPlaceholders) {
    if (headerPlaceholders) {
        headerPlaceholders.forEach(function (element) {
            var _a, _b;
            var headerName = (_a = element.split('.').pop()) === null || _a === void 0 ? void 0 : _a.slice(0, -1);
            if (typeof headerName !== 'undefined') {
                var value = (_b = (0, http_headers_1.getHeader)(headers, headerName)) !== null && _b !== void 0 ? _b : '';
                message = message.replace(element, value);
            }
        });
    }
    return message;
}
function replaceBodyPlaceholders(message, body, bodyPlaceholders) {
    var parsed = '';
    try {
        parsed = JSON.parse(body);
    }
    catch (error) {
        // Handle the error if needed, or you can leave the catch block empty
    }
    bodyPlaceholders === null || bodyPlaceholders === void 0 ? void 0 : bodyPlaceholders.forEach(function (element) {
        var _a;
        if (element.includes('#')) {
            var _b = tslib_1.__read(element === null || element === void 0 ? void 0 : element.split('#')), rest = _b.slice(1);
            var nodePointer = (_a = rest.join('#')) === null || _a === void 0 ? void 0 : _a.slice(0, -1);
            if (nodePointer) {
                var value = json_ptr_1.JsonPointer.create(nodePointer).get(parsed);
                var replaced_value = typeof value !== 'undefined' ? JSON.stringify(value) : '';
                message = message.replace(element, replaced_value);
            }
        }
        else {
            message = message.replace(element, JSON.stringify(parsed));
        }
    });
    return message;
}
