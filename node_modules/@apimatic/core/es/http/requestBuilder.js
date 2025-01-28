import { __spreadArray, __read, __assign, __awaiter, __generator, __values } from 'tslib';
import JSONBig from '@apimatic/json-bigint';
import { deprecated, sanitizeUrl, updateErrorMessage } from '../apiHelper.js';
import { ArgumentsValidationError } from '../errors/argumentsValidationError.js';
import { ResponseValidationError } from '../errors/responseValidationError.js';
import { validateAndUnmapXml, validateAndMapXml, validateAndMap } from '@apimatic/schema';
import { JSON_CONTENT_TYPE, setHeader, mergeHeaders, TEXT_CONTENT_TYPE, XML_CONTENT_TYPE, ACCEPT_HEADER, CONTENT_TYPE_HEADER, CONTENT_LENGTH_HEADER, setHeaderIfNotSet } from '@apimatic/http-headers';
import { callHttpInterceptors } from './httpInterceptor.js';
import { SkipEncode, pathTemplate } from './pathTemplate.js';
import { urlEncodeObject, filterFileWrapperFromKeyValuePairs, formDataEncodeObject } from '@apimatic/http-query';
import { prepareArgs } from './validate.js';
import { shouldRetryRequest, RequestRetryOption, getRetryWaitTime } from './retryConfiguration.js';
import { convertToStream } from '@apimatic/convert-to-stream';
import { XmlSerialization } from '../xml/xmlSerializer.js';
var JSON = /*#__PURE__*/JSONBig();
function skipEncode(value) {
  return new SkipEncode(value);
}
var DefaultRequestBuilder =
/*#__PURE__*/
/** @class */
function () {
  function DefaultRequestBuilder(_httpClient, _baseUrlProvider, _apiErrorCtr, _authenticationProvider, _httpMethod, _xmlSerializer, _retryConfig, _path, _apiLogger) {
    this._httpClient = _httpClient;
    this._baseUrlProvider = _baseUrlProvider;
    this._apiErrorCtr = _apiErrorCtr;
    this._authenticationProvider = _authenticationProvider;
    this._httpMethod = _httpMethod;
    this._xmlSerializer = _xmlSerializer;
    this._retryConfig = _retryConfig;
    this._path = _path;
    this._apiLogger = _apiLogger;
    this._headers = {};
    this._query = [];
    this._interceptors = [];
    this._errorTypes = [];
    this._validateResponse = true;
    this._apiErrorFactory = {
      apiErrorCtor: _apiErrorCtr
    };
    this._addResponseValidator();
    this._addAuthentication();
    this._addRetryInterceptor();
    this._addErrorHandlingInterceptor();
    this._addApiLoggerInterceptors();
    this._retryOption = RequestRetryOption.Default;
    this.prepareArgs = prepareArgs.bind(this);
  }
  DefaultRequestBuilder.prototype.authenticate = function (params) {
    this._authParams = params;
  };
  DefaultRequestBuilder.prototype.requestRetryOption = function (option) {
    this._retryOption = option;
  };
  DefaultRequestBuilder.prototype.deprecated = function (methodName, message) {
    deprecated(methodName, message);
  };
  DefaultRequestBuilder.prototype.appendTemplatePath = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var pathSegment = pathTemplate.apply(void 0, __spreadArray([strings], __read(args), false));
    this.appendPath(pathSegment);
  };
  DefaultRequestBuilder.prototype.method = function (httpMethodName) {
    this._httpMethod = httpMethodName;
  };
  DefaultRequestBuilder.prototype.baseUrl = function (arg) {
    this._baseUrlArg = arg;
  };
  DefaultRequestBuilder.prototype.appendPath = function (path) {
    this._path = this._path ? mergePath(this._path, path) : path;
  };
  DefaultRequestBuilder.prototype.acceptJson = function () {
    this._accept = JSON_CONTENT_TYPE;
  };
  DefaultRequestBuilder.prototype.accept = function (acceptHeaderValue) {
    this._accept = acceptHeaderValue;
  };
  DefaultRequestBuilder.prototype.contentType = function (contentTypeHeaderValue) {
    this._contentType = contentTypeHeaderValue;
  };
  DefaultRequestBuilder.prototype.header = function (name, value) {
    if (value === null || typeof value === 'undefined') {
      return;
    }
    if (typeof value === 'object') {
      setHeader(this._headers, name, JSON.stringify(value));
      return;
    }
    // String() is used to convert boolean, number, bigint, or unknown types
    setHeader(this._headers, name, String(value));
  };
  DefaultRequestBuilder.prototype.headers = function (headersToMerge) {
    mergeHeaders(this._headers, headersToMerge);
  };
  DefaultRequestBuilder.prototype.query = function (nameOrParameters, value, prefixFormat) {
    var _a;
    if (nameOrParameters === null || nameOrParameters === undefined) {
      return;
    }
    var queryString = typeof nameOrParameters === 'string' ? urlEncodeObject((_a = {}, _a[nameOrParameters] = value, _a), prefixFormat) : urlEncodeObject(nameOrParameters, prefixFormat);
    if (queryString) {
      this._query.push(queryString);
    }
  };
  DefaultRequestBuilder.prototype.text = function (body) {
    var _a;
    this._body = (_a = body === null || body === void 0 ? void 0 : body.toString()) !== null && _a !== void 0 ? _a : undefined;
    this._setContentTypeIfNotSet(TEXT_CONTENT_TYPE);
  };
  DefaultRequestBuilder.prototype.json = function (data) {
    this._body = JSON.stringify(data);
    this._setContentTypeIfNotSet(JSON_CONTENT_TYPE);
  };
  DefaultRequestBuilder.prototype.xml = function (argName, data, rootName, schema) {
    var _a;
    var mappingResult = validateAndUnmapXml(data, schema);
    if (mappingResult.errors) {
      throw new ArgumentsValidationError((_a = {}, _a[argName] = mappingResult.errors, _a));
    }
    this._body = this._xmlSerializer.xmlSerialize(rootName, mappingResult.result);
    this._setContentTypeIfNotSet(XML_CONTENT_TYPE);
  };
  DefaultRequestBuilder.prototype.stream = function (file) {
    this._stream = file;
  };
  DefaultRequestBuilder.prototype.form = function (parameters, prefixFormat) {
    this._form = filterFileWrapperFromKeyValuePairs(formDataEncodeObject(parameters, prefixFormat));
  };
  DefaultRequestBuilder.prototype.formData = function (parameters, prefixFormat) {
    this._formData = formDataEncodeObject(parameters, prefixFormat);
  };
  DefaultRequestBuilder.prototype.toRequest = function () {
    var request = {
      method: this._httpMethod,
      url: mergePath(this._baseUrlProvider(this._baseUrlArg), this._path)
    };
    if (this._query.length > 0) {
      var queryString = this._query.join('&');
      request.url += (request.url.indexOf('?') === -1 ? '?' : '&') + queryString;
    }
    request.url = sanitizeUrl(request.url);
    // defensively copy headers
    var headers = __assign({}, this._headers);
    if (this._accept) {
      setHeader(headers, ACCEPT_HEADER, this._accept);
    }
    if (this._contentType) {
      setHeader(headers, CONTENT_TYPE_HEADER, this._contentType);
    }
    setHeader(headers, CONTENT_LENGTH_HEADER);
    request.headers = headers;
    if (this._body !== undefined) {
      request.body = {
        type: 'text',
        content: this._body
      };
    } else if (this._form !== undefined) {
      request.body = {
        type: 'form',
        content: this._form
      };
    } else if (this._formData !== undefined) {
      request.body = {
        type: 'form-data',
        content: this._formData
      };
    } else if (this._stream !== undefined) {
      request.body = {
        type: 'stream',
        content: this._stream
      };
    }
    return request;
  };
  DefaultRequestBuilder.prototype.intercept = function (interceptor) {
    this._interceptors.push(interceptor);
  };
  DefaultRequestBuilder.prototype.interceptRequest = function (interceptor) {
    this.intercept(function (req, opt, next) {
      return next(interceptor(req), opt);
    });
  };
  DefaultRequestBuilder.prototype.interceptResponse = function (interceptor) {
    var _this = this;
    this.intercept(function (req, opt, next) {
      return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              _a = interceptor;
              return [4 /*yield*/, next(req, opt)];
            case 1:
              return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
          }
        });
      });
    });
  };
  DefaultRequestBuilder.prototype.defaultToError = function (apiErrorCtor, message) {
    this._apiErrorFactory = {
      apiErrorCtor: apiErrorCtor,
      message: message
    };
  };
  DefaultRequestBuilder.prototype.validateResponse = function (validate) {
    this._validateResponse = validate;
  };
  DefaultRequestBuilder.prototype.throwOn = function (statusCode, errorConstructor, isTemplate) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      args[_i - 3] = arguments[_i];
    }
    this._errorTypes.push({
      statusCode: statusCode,
      errorConstructor: errorConstructor,
      isTemplate: isTemplate,
      args: args
    });
  };
  DefaultRequestBuilder.prototype.call = function (requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var pipeline, _a, request, response;
      var _this = this;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            pipeline = callHttpInterceptors(this._interceptors,
            // tslint:disable-next-line:no-shadowed-variable
            function (request, opt) {
              return __awaiter(_this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4 /*yield*/, this._httpClient(request, opt)];
                    case 1:
                      response = _a.sent();
                      return [2 /*return*/, {
                        request: request,
                        response: response
                      }];
                  }
                });
              });
            });
            return [4 /*yield*/, pipeline(this.toRequest(), requestOptions)];
          case 1:
            _a = _b.sent(), request = _a.request, response = _a.response;
            return [2 /*return*/, __assign(__assign({}, response), {
              request: request,
              result: undefined
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype.callAsText = function (requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.call(requestOptions)];
          case 1:
            result = _a.sent();
            if (typeof result.body !== 'string') {
              throw new Error('Could not parse body as string.'); // TODO: Replace with SDK error
            }
            return [2 /*return*/, __assign(__assign({}, result), {
              result: result.body
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype.callAsOptionalText = function (requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.call(requestOptions)];
          case 1:
            result = _a.sent();
            if (typeof result.body !== 'string') {
              return [2 /*return*/, __assign(__assign({}, result), {
                result: undefined
              })];
            }
            return [2 /*return*/, __assign(__assign({}, result), {
              result: result.body
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype.callAsStream = function (requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.interceptRequest(function (req) {
              return __assign(__assign({}, req), {
                responseType: 'stream'
              });
            });
            return [4 /*yield*/, this.call(requestOptions)];
          case 1:
            result = _a.sent();
            return [2 /*return*/, __assign(__assign({}, result), {
              result: convertToStream(result.body)
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype.callAsJson = function (schema, requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var result;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.interceptRequest(function (request) {
              var headers = __assign({}, request.headers);
              setHeaderIfNotSet(headers, ACCEPT_HEADER, JSON_CONTENT_TYPE);
              return __assign(__assign({}, request), {
                headers: headers
              });
            });
            return [4 /*yield*/, this.call(requestOptions)];
          case 1:
            result = _a.sent();
            return [2 /*return*/, __assign(__assign({}, result), {
              result: parseJsonResult(schema, result)
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype.callAsXml = function (rootName, schema, requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
      var result, xmlObject, error_1, mappingResult;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.interceptRequest(function (request) {
              var headers = __assign({}, request.headers);
              setHeaderIfNotSet(headers, ACCEPT_HEADER, XML_CONTENT_TYPE);
              return __assign(__assign({}, request), {
                headers: headers
              });
            });
            return [4 /*yield*/, this.call(requestOptions)];
          case 1:
            result = _a.sent();
            if (result.body === '') {
              throw new Error('Could not parse body as XML. The response body is empty.');
            }
            if (typeof result.body !== 'string') {
              throw new Error('Could not parse body as XML. The response body is not a string.');
            }
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4,, 5]);
            return [4 /*yield*/, this._xmlSerializer.xmlDeserialize(rootName, result.body)];
          case 3:
            xmlObject = _a.sent();
            return [3 /*break*/, 5];
          case 4:
            error_1 = _a.sent();
            throw new Error("Could not parse body as XML.\n\n".concat(error_1.message));
          case 5:
            mappingResult = validateAndMapXml(xmlObject, schema);
            if (mappingResult.errors) {
              throw new ResponseValidationError(result, mappingResult.errors);
            }
            return [2 /*return*/, __assign(__assign({}, result), {
              result: mappingResult.result
            })];
        }
      });
    });
  };
  DefaultRequestBuilder.prototype._setContentTypeIfNotSet = function (contentType) {
    if (!this._contentType) {
      setHeaderIfNotSet(this._headers, CONTENT_TYPE_HEADER, contentType);
    }
  };
  DefaultRequestBuilder.prototype._addResponseValidator = function () {
    var _this = this;
    this.interceptResponse(function (context) {
      var _a;
      var response = context.response;
      if (_this._validateResponse && (response.statusCode < 200 || response.statusCode >= 300)) {
        if (typeof ((_a = _this._apiErrorFactory) === null || _a === void 0 ? void 0 : _a.message) === 'undefined') {
          _this._apiErrorFactory.message = "Response status code was not ok: ".concat(response.statusCode, ".");
        }
        throw new _this._apiErrorFactory.apiErrorCtor(context, _this._apiErrorFactory.message);
      }
      return context;
    });
  };
  DefaultRequestBuilder.prototype._addApiLoggerInterceptors = function () {
    var _this = this;
    if (this._apiLogger) {
      var apiLogger_1 = this._apiLogger;
      this.intercept(function (request, options, next) {
        return __awaiter(_this, void 0, void 0, function () {
          var context;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                apiLogger_1.logRequest(request);
                return [4 /*yield*/, next(request, options)];
              case 1:
                context = _a.sent();
                apiLogger_1.logResponse(context.response);
                return [2 /*return*/, context];
            }
          });
        });
      });
    }
  };
  DefaultRequestBuilder.prototype._addAuthentication = function () {
    var _this = this;
    this.intercept(function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      var handler = _this._authenticationProvider(_this._authParams);
      return handler.apply(void 0, __spreadArray([], __read(args), false));
    });
  };
  DefaultRequestBuilder.prototype._addRetryInterceptor = function () {
    var _this = this;
    this.intercept(function (request, options, next) {
      return __awaiter(_this, void 0, void 0, function () {
        var context, allowedWaitTime, retryCount, waitTime, timeoutError, shouldRetry, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              allowedWaitTime = this._retryConfig.maximumRetryWaitTime;
              retryCount = 0;
              waitTime = 0;
              shouldRetry = shouldRetryRequest(this._retryOption, this._retryConfig, this._httpMethod);
              _c.label = 1;
            case 1:
              timeoutError = undefined;
              if (!(retryCount > 0)) return [3 /*break*/, 3];
              return [4 /*yield*/, new Promise(function (res) {
                return setTimeout(res, waitTime * 1000);
              })];
            case 2:
              _c.sent();
              allowedWaitTime -= waitTime;
              _c.label = 3;
            case 3:
              _c.trys.push([3, 5,, 6]);
              return [4 /*yield*/, next(request, options)];
            case 4:
              context = _c.sent();
              return [3 /*break*/, 6];
            case 5:
              error_2 = _c.sent();
              timeoutError = error_2;
              return [3 /*break*/, 6];
            case 6:
              if (shouldRetry) {
                waitTime = getRetryWaitTime(this._retryConfig, allowedWaitTime, retryCount, (_a = context === null || context === void 0 ? void 0 : context.response) === null || _a === void 0 ? void 0 : _a.statusCode, (_b = context === null || context === void 0 ? void 0 : context.response) === null || _b === void 0 ? void 0 : _b.headers, timeoutError);
                retryCount++;
              }
              _c.label = 7;
            case 7:
              if (waitTime > 0) return [3 /*break*/, 1];
              _c.label = 8;
            case 8:
              if (timeoutError) {
                throw timeoutError;
              }
              if (typeof (context === null || context === void 0 ? void 0 : context.response) === 'undefined') {
                throw new Error('Response is undefined.');
              }
              return [2 /*return*/, {
                request: request,
                response: context.response
              }];
          }
        });
      });
    });
  };
  DefaultRequestBuilder.prototype._addErrorHandlingInterceptor = function () {
    var _this = this;
    this.interceptResponse(function (context) {
      var e_1, _a;
      var response = context.response;
      try {
        for (var _b = __values(_this._errorTypes), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = _c.value,
            statusCode = _d.statusCode,
            errorConstructor = _d.errorConstructor,
            isTemplate = _d.isTemplate,
            args = _d.args;
          if (typeof statusCode === 'number' && response.statusCode === statusCode || typeof statusCode !== 'number' && response.statusCode >= statusCode[0] && response.statusCode <= statusCode[1]) {
            if (isTemplate && args.length > 0) {
              args[0] = updateErrorMessage(args[0], response);
            }
            throw new (errorConstructor.bind.apply(errorConstructor, __spreadArray([void 0, context], __read(args), false)))();
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return context;
    });
  };
  return DefaultRequestBuilder;
}();
function createRequestBuilderFactory(httpClient, baseUrlProvider, apiErrorConstructor, authenticationProvider, retryConfig, xmlSerializer, apiLogger) {
  if (xmlSerializer === void 0) {
    xmlSerializer = new XmlSerialization();
  }
  return function (httpMethod, path) {
    return new DefaultRequestBuilder(httpClient, baseUrlProvider, apiErrorConstructor, authenticationProvider, httpMethod, xmlSerializer, retryConfig, path, apiLogger);
  };
}
function mergePath(left, right) {
  if (!right || right === '') {
    return left;
  }
  // remove all occurances of `/` (if any) from the end of left path
  left = left.replace('/', ' ').trimEnd().replace(' ', '/');
  // remove all occurances of `/` (if any) from the start of right sub-path
  right = right.replace('/', ' ').trimStart().replace(' ', '/');
  return "".concat(left, "/").concat(right);
}
function parseJsonResult(schema, res) {
  if (typeof res.body !== 'string') {
    throw new Error('Could not parse body as JSON. The response body is not a string.');
  }
  if (res.body.trim() === '') {
    var resEmptyErr_1 = new Error('Could not parse body as JSON. The response body is empty.');
    return validateJson(schema, null, function (_) {
      return resEmptyErr_1;
    });
  }
  var parsed;
  try {
    parsed = JSON.parse(res.body);
  } catch (error) {
    var resUnParseErr_1 = new Error("Could not parse body as JSON.\n\n".concat(error.message));
    return validateJson(schema, res.body, function (_) {
      return resUnParseErr_1;
    });
  }
  var resInvalidErr = function (errors) {
    return new ResponseValidationError(res, errors);
  };
  return validateJson(schema, parsed, function (errors) {
    return resInvalidErr(errors);
  });
}
function validateJson(schema, value, errorCreater) {
  var mappingResult = validateAndMap(value, schema);
  if (mappingResult.errors) {
    throw errorCreater(mappingResult.errors);
  }
  return mappingResult.result;
}
export { DefaultRequestBuilder, createRequestBuilderFactory, skipEncode };