import { __assign, __values, __awaiter, __generator } from 'tslib';
import axios, { AxiosHeaders } from 'axios';
import isNode from 'detect-node';
import FormData from 'form-data';
import { CONTENT_TYPE_HEADER, FORM_URLENCODED_CONTENT_TYPE } from '@apimatic/http-headers';
import { urlEncodeKeyValuePairs } from '@apimatic/http-query';
import { isFileWrapper } from '@apimatic/file-wrapper';
var DEFAULT_AXIOS_CONFIG_OVERRIDES = {
  transformResponse: []
};
var DEFAULT_TIMEOUT = 30 * 1000;
/**
 * HTTP client implementation.
 *
 * This implementation is a wrapper over the Axios client.
 */
var HttpClient =
/*#__PURE__*/
/** @class */
function () {
  function HttpClient(abortErrorFactory, _a) {
    var _b = _a === void 0 ? {} : _a,
      clientConfigOverrides = _b.clientConfigOverrides,
      _c = _b.timeout,
      timeout = _c === void 0 ? DEFAULT_TIMEOUT : _c,
      httpAgent = _b.httpAgent,
      httpsAgent = _b.httpsAgent;
    this._timeout = timeout;
    this._axiosInstance = axios.create(__assign(__assign(__assign({}, DEFAULT_AXIOS_CONFIG_OVERRIDES), clientConfigOverrides), {
      httpAgent: httpAgent,
      httpsAgent: httpsAgent
    }));
    this._abortErrorFactory = abortErrorFactory;
  }
  /** Converts an HttpRequest object to an Axios request. */
  HttpClient.prototype.convertHttpRequest = function (req) {
    var e_1, _a;
    var _b, _c;
    var newRequest = {
      method: req.method,
      url: req.url,
      responseType: 'text',
      headers: __assign({}, req.headers)
    };
    var headers = new AxiosHeaders(__assign({}, req.headers));
    if (req.auth) {
      // Set basic auth credentials if provided
      newRequest.auth = {
        username: req.auth.username,
        password: req.auth.password || ''
      };
    }
    var requestBody = req.body;
    if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.type) === 'text') {
      newRequest.data = requestBody.content;
    } else if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.type) === 'form-data' && requestBody.content.some(function (item) {
      return isFileWrapper(item.value);
    })) {
      // Create multipart request if a file is present
      var form = new FormData();
      try {
        for (var _d = __values(requestBody.content), _e = _d.next(); !_e.done; _e = _d.next()) {
          var iter = _e.value;
          if (isFileWrapper(iter.value)) {
            var fileData = iter.value.file;
            // Make sure Blob has the correct content type if provided
            if (isBlob(fileData) && ((_b = iter.value.options) === null || _b === void 0 ? void 0 : _b.contentType)) {
              fileData = new Blob([fileData], {
                type: iter.value.options.contentType
              });
            }
            form.append(iter.key, fileData, iter.value.options);
          } else {
            form.append(iter.key, iter.value);
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      newRequest.data = form;
      headers = headers.concat(form.getHeaders());
    } else if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.type) === 'form-data' || (requestBody === null || requestBody === void 0 ? void 0 : requestBody.type) === 'form') {
      // Create form-urlencoded request
      headers = headers.set(CONTENT_TYPE_HEADER, FORM_URLENCODED_CONTENT_TYPE);
      newRequest.data = urlEncodeKeyValuePairs(requestBody.content);
    } else if ((requestBody === null || requestBody === void 0 ? void 0 : requestBody.type) === 'stream') {
      var contentType = 'application/octet-stream';
      if (isBlob(requestBody.content.file) && requestBody.content.file.type) {
        // Set Blob mime type as the content-type header if present
        contentType = requestBody.content.file.type;
      } else if ((_c = requestBody.content.options) === null || _c === void 0 ? void 0 : _c.contentType) {
        // Otherwise, use the content type if available.
        contentType = requestBody.content.options.contentType;
      }
      headers = headers.set(CONTENT_TYPE_HEADER, contentType, false);
      newRequest.data = requestBody.content.file;
    }
    if (req.responseType === 'stream') {
      newRequest.responseType = isNode ? 'stream' : 'blob';
    }
    // Prevent superagent from converting any status code to error
    newRequest.validateStatus = function () {
      return true;
    };
    // Set 30 seconds timeout
    newRequest.timeout = this._timeout;
    // set headers
    newRequest.headers = headers;
    return newRequest;
  };
  /** Converts an Axios response to an HttpResponse object. */
  HttpClient.prototype.convertHttpResponse = function (resp) {
    return {
      body: resp.data,
      headers: this.convertAxiosResponseHeadersToHttpResponseHeaders(resp.headers),
      statusCode: resp.status
    };
  };
  HttpClient.prototype.convertAxiosResponseHeadersToHttpResponseHeaders = function (axiosHeaders) {
    var httpResponseHeaders = {};
    // Iterate through each property of AxiosResponseHeaders
    for (var key in axiosHeaders) {
      // Check if the property is not a function (AxiosHeaders may have methods)
      if (typeof axiosHeaders[key] !== 'function') {
        // Convert property key to lowercase as HTTP headers are case-insensitive
        var lowercaseKey = key.toLowerCase();
        // Assign the value to HttpResponse headers
        httpResponseHeaders[lowercaseKey] = String(axiosHeaders[key]);
      }
    }
    return httpResponseHeaders;
  };
  /**
   * Executes the HttpRequest with the given options and returns the HttpResponse
   * or throws an error.
   */
  HttpClient.prototype.executeRequest = function (request, requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var axiosRequest, cancelToken_1, _a, error_1;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            axiosRequest = this.convertHttpRequest(request);
            if (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal) {
              // throw if already aborted; do not place HTTP call
              if (requestOptions.abortSignal.aborted) {
                throw this.abortError();
              }
              cancelToken_1 = axios.CancelToken.source();
              axiosRequest.cancelToken = cancelToken_1.token;
              // attach abort event handler
              requestOptions.abortSignal.addEventListener('abort', function () {
                cancelToken_1.cancel();
              });
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3,, 4]);
            _a = this.convertHttpResponse;
            return [4 /*yield*/, this._axiosInstance(axiosRequest)];
          case 2:
            return [2 /*return*/, _a.apply(this, [_b.sent()])];
          case 3:
            error_1 = _b.sent();
            // abort error should be thrown as the AbortError
            if (axios.isCancel(error_1)) {
              throw this.abortError();
            }
            throw error_1;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  HttpClient.prototype.abortError = function () {
    return new this._abortErrorFactory('The HTTP call was aborted.');
  };
  return HttpClient;
}();
/**
 * Check whether value is an instance of Blob
 *
 * @remark
 * Reference: https://github.com/sindresorhus/is-blob/blob/master/index.js
 *
 * @param value Value to check
 * @returns True if the value is a Blob instance
 */
function isBlob(value) {
  if (typeof Blob === 'undefined') {
    return false;
  }
  return value instanceof Blob || Object.prototype.toString.call(value) === '[object Blob]';
}
export { DEFAULT_AXIOS_CONFIG_OVERRIDES, DEFAULT_TIMEOUT, HttpClient, isBlob };