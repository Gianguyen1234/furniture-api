import { __spreadArray, __read, __values } from 'tslib';
import { isFileWrapper, cloneFileWrapper } from '@apimatic/file-wrapper';
function objectEncoding(key, iter, value, prefixFormat) {
  var _a;
  return formDataEncodeObject((_a = {}, _a["".concat(key, "[").concat(iter, "]")] = value, _a), prefixFormat);
}
function objectArrayEncoding(key, value, prefixFormat, result) {
  for (var iter = 0; iter < value.length; iter += 1) {
    result.push.apply(result, __spreadArray([], __read(objectEncoding(key, iter, value[iter], prefixFormat)), false));
  }
}
/**
 * Array prefix format: item[1]=1&item[2]=2
 */
var indexedPrefix = function (key, value, result) {
  for (var iter = 0; iter < value.length; iter += 1) {
    result.push.apply(result, __spreadArray([], __read(objectEncoding(key, iter, value[iter], indexedPrefix)), false));
  }
};
/**
 * Array prefix format: item[]=1&item[]=2
 */
var unindexedPrefix = function (key, value, result) {
  var e_1, _a, _b;
  if (value.some(function (val) {
    return typeof val === 'object';
  })) {
    objectArrayEncoding(key, value, unindexedPrefix, result);
  } else {
    try {
      for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
        var val = value_1_1.value;
        result.push.apply(result, __spreadArray([], __read(formDataEncodeObject((_b = {}, _b[key + '[]'] = val, _b), unindexedPrefix)), false));
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
};
/**
 * Array prefix format: item=1&item=2
 */
var plainPrefix = function (key, value, result) {
  var e_2, _a, _b;
  if (value.some(function (val) {
    return typeof val === 'object';
  })) {
    objectArrayEncoding(key, value, plainPrefix, result);
  } else {
    try {
      for (var value_2 = __values(value), value_2_1 = value_2.next(); !value_2_1.done; value_2_1 = value_2.next()) {
        var val = value_2_1.value;
        result.push.apply(result, __spreadArray([], __read(formDataEncodeObject((_b = {}, _b[key] = val, _b), plainPrefix)), false));
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (value_2_1 && !value_2_1.done && (_a = value_2.return)) _a.call(value_2);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  }
};
/**
 * Array prefix format: item=1\t2
 */
var tabPrefix = function (key, value, result) {
  if (value.some(function (val) {
    return typeof val === 'object';
  })) {
    objectArrayEncoding(key, value, tabPrefix, result);
  } else {
    var prefixedArray = value.map(function (element) {
      return element.toString();
    }).join('\t');
    result.push.apply(result, [{
      key: key,
      value: prefixedArray
    }]);
  }
};
/**
 * Array prefix format: item=1,2
 */
var commaPrefix = function (key, value, result) {
  if (value.some(function (val) {
    return typeof val === 'object';
  })) {
    objectArrayEncoding(key, value, commaPrefix, result);
  } else {
    var prefixedArray = value.map(function (element) {
      return element.toString();
    }).join(',');
    result.push.apply(result, [{
      key: key,
      value: prefixedArray
    }]);
  }
};
/**
 * Array prefix format: item=1|2
 */
var pipePrefix = function (key, value, result) {
  if (value.some(function (val) {
    return typeof val === 'object';
  })) {
    objectArrayEncoding(key, value, pipePrefix, result);
  } else {
    var prefixedArray = value.map(function (element) {
      return element.toString();
    }).join('|');
    result.push.apply(result, [{
      key: key,
      value: prefixedArray
    }]);
  }
};
/**
 * Converts an object to a list of key-value pairs for form-urlencoded serialization.
 *
 * @param obj The object to serialize
 * @param prefixFormat Formatting function to create key for nested arrays
 * @return Result of serialization
 */
function formDataEncodeObject(obj, prefixFormat) {
  var e_3, _a, _b;
  if (prefixFormat === void 0) {
    prefixFormat = indexedPrefix;
  }
  var result = [];
  try {
    for (var _c = __values(Object.keys(obj)), _d = _c.next(); !_d.done; _d = _c.next()) {
      var key = _d.value;
      var value = obj[key];
      if (value === null || value === undefined) {
        continue;
      } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
        result.push({
          key: key,
          value: value.toString()
        });
      } else if (isFileWrapper(value)) {
        result.push({
          key: key,
          value: cloneFileWrapper(value)
        });
      } else if (Array.isArray(value)) {
        prefixFormat(key, value, result);
      } else if (typeof value === 'object') {
        for (var objectKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, objectKey)) {
            var element = value[objectKey];
            result.push.apply(result, __spreadArray([], __read(formDataEncodeObject((_b = {}, _b["".concat(key, "[").concat(objectKey, "]")] = element, _b), prefixFormat)), false));
          }
        }
      }
    }
  } catch (e_3_1) {
    e_3 = {
      error: e_3_1
    };
  } finally {
    try {
      if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
    } finally {
      if (e_3) throw e_3.error;
    }
  }
  return result;
}
/**
 * Return a new list with all key-value pairs, which have a FileWrapper as value, removed
 *
 * @param params List of key-value pairs
 */
function filterFileWrapperFromKeyValuePairs(params) {
  return params.filter(function (p) {
    return !isFileWrapper(p.value);
  });
}
/**
 * Serializes an object for a form-urlencoded request.
 *
 * Nested and complex types in values will be flattened using {@link formDataEncodeObject() function} method.
 *
 * @param  obj The object to be serialized
 * @return The result of serialization
 */
function urlEncodeObject(obj, prefixFormat) {
  var params = formDataEncodeObject(obj, prefixFormat);
  return urlEncodeKeyValuePairs(params);
}
/**
 * Serializes a list of key-value pairs for a form-urlencoded request.
 *
 * @param params List of key-value pairs to serialize
 * @return The result of serialization
 */
function urlEncodeKeyValuePairs(params) {
  var encode = encodeURIComponent;
  return params.map(function (p) {
    return "".concat(encode(p.key), "=").concat(encode(p.value.toString()));
  }).join('&');
}
export { commaPrefix, filterFileWrapperFromKeyValuePairs, formDataEncodeObject, indexedPrefix, objectArrayEncoding, objectEncoding, pipePrefix, plainPrefix, tabPrefix, unindexedPrefix, urlEncodeKeyValuePairs, urlEncodeObject };