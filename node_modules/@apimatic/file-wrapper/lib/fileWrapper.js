"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneFileWrapper = exports.isFileWrapper = exports.FileWrapper = void 0;
var tslib_1 = require("tslib");
/**
 * Wraps file with mime-type and filename to be sent as part of an HTTP request.
 */
var FileWrapper = /** @class */ (function () {
    function FileWrapper(file, options) {
        this.file = file;
        this.options = options;
        this.file = file;
    }
    return FileWrapper;
}());
exports.FileWrapper = FileWrapper;
/** Returns true if value is a FileWrapper */
function isFileWrapper(value) {
    return value instanceof FileWrapper;
}
exports.isFileWrapper = isFileWrapper;
/**
 * Returns a deep clone of the FileWrapper instance
 *
 * @param fileWrapper FileWrapper instance to copy
 */
function cloneFileWrapper(fileWrapper) {
    var options;
    if (fileWrapper.options) {
        options = cloneFileWrapperOptions(fileWrapper.options);
    }
    return new FileWrapper(fileWrapper.file, options);
}
exports.cloneFileWrapper = cloneFileWrapper;
function cloneFileWrapperOptions(fileWrapperOptions) {
    var clone = tslib_1.__assign({}, fileWrapperOptions);
    if (fileWrapperOptions.headers) {
        clone.headers = tslib_1.__assign({}, fileWrapperOptions.headers);
    }
    return clone;
}
