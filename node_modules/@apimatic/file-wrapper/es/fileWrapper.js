import { __assign } from 'tslib';

/**
 * Wraps file with mime-type and filename to be sent as part of an HTTP request.
 */
var FileWrapper =
/*#__PURE__*/
/** @class */
function () {
  function FileWrapper(file, options) {
    this.file = file;
    this.options = options;
    this.file = file;
  }
  return FileWrapper;
}();
/** Returns true if value is a FileWrapper */
function isFileWrapper(value) {
  return value instanceof FileWrapper;
}
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
function cloneFileWrapperOptions(fileWrapperOptions) {
  var clone = __assign({}, fileWrapperOptions);
  if (fileWrapperOptions.headers) {
    clone.headers = __assign({}, fileWrapperOptions.headers);
  }
  return clone;
}
export { FileWrapper, cloneFileWrapper, isFileWrapper };