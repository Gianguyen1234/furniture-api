"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestBuilderFactory = exports.DefaultRequestBuilder = exports.skipEncode = void 0;
var tslib_1 = require("tslib");
var json_bigint_1 = tslib_1.__importDefault(require("@apimatic/json-bigint"));
var apiHelper_1 = require("../apiHelper");
var argumentsValidationError_1 = require("../errors/argumentsValidationError");
var responseValidationError_1 = require("../errors/responseValidationError");
var schema_1 = require("../schema");
var httpHeaders_1 = require("./httpHeaders");
var httpInterceptor_1 = require("./httpInterceptor");
var pathTemplate_1 = require("./pathTemplate");
var queryString_1 = require("./queryString");
var validate_1 = require("./validate");
var retryConfiguration_1 = require("./retryConfiguration");
var convert_to_stream_1 = require("@apimatic/convert-to-stream");
var xmlSerializer_1 = require("../xml/xmlSerializer");
var JSON = (0, json_bigint_1.default)();
function skipEncode(value) {
    return new pathTemplate_1.SkipEncode(value);
}
exports.skipEncode = skipEncode;
var DefaultRequestBuilder = /** @class */ (function () {
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
        this._apiErrorFactory = { apiErrorCtor: _apiErrorCtr };
        this._addResponseValidator();
        this._addAuthentication();
        this._addRetryInterceptor();
        this._addErrorHandlingInterceptor();
        this._addApiLoggerInterceptors();
        this._retryOption = retryConfiguration_1.RequestRetryOption.Default;
        this.prepareArgs = validate_1.prepareArgs.bind(this);
    }
    DefaultRequestBuilder.prototype.authenticate = function (params) {
        this._authParams = params;
    };
    DefaultRequestBuilder.prototype.requestRetryOption = function (option) {
        this._retryOption = option;
    };
    DefaultRequestBuilder.prototype.deprecated = function (methodName, message) {
        (0, apiHelper_1.deprecated)(methodName, message);
    };
    DefaultRequestBuilder.prototype.appendTemplatePath = function (strings) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var pathSegment = pathTemplate_1.pathTemplate.apply(void 0, tslib_1.__spreadArray([strings], tslib_1.__read(args), false));
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
        this._accept = httpHeaders_1.JSON_CONTENT_TYPE;
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
            (0, httpHeaders_1.setHeader)(this._headers, name, JSON.stringify(value));
            return;
        }
        // String() is used to convert boolean, number, bigint, or unknown types
        (0, httpHeaders_1.setHeader)(this._headers, name, String(value));
    };
    DefaultRequestBuilder.prototype.headers = function (headersToMerge) {
        (0, httpHeaders_1.mergeHeaders)(this._headers, headersToMerge);
    };
    DefaultRequestBuilder.prototype.query = function (nameOrParameters, value, prefixFormat) {
        var _a;
        if (nameOrParameters === null || nameOrParameters === undefined) {
            return;
        }
        var queryString = typeof nameOrParameters === 'string'
            ? (0, queryString_1.urlEncodeObject)((_a = {},
                _a[nameOrParameters] = value,
                _a), prefixFormat)
            : (0, queryString_1.urlEncodeObject)(nameOrParameters, prefixFormat);
        if (queryString) {
            this._query.push(queryString);
        }
    };
    DefaultRequestBuilder.prototype.text = function (body) {
        var _a;
        this._body = (_a = body === null || body === void 0 ? void 0 : body.toString()) !== null && _a !== void 0 ? _a : undefined;
        this._setContentTypeIfNotSet(httpHeaders_1.TEXT_CONTENT_TYPE);
    };
    DefaultRequestBuilder.prototype.json = function (data) {
        this._body = JSON.stringify(data);
        this._setContentTypeIfNotSet(httpHeaders_1.JSON_CONTENT_TYPE);
    };
    DefaultRequestBuilder.prototype.xml = function (argName, data, rootName, schema) {
        var _a;
        var mappingResult = (0, schema_1.validateAndUnmapXml)(data, schema);
        if (mappingResult.errors) {
            throw new argumentsValidationError_1.ArgumentsValidationError((_a = {}, _a[argName] = mappingResult.errors, _a));
        }
        this._body = this._xmlSerializer.xmlSerialize(rootName, mappingResult.result);
        this._setContentTypeIfNotSet(httpHeaders_1.XML_CONTENT_TYPE);
    };
    DefaultRequestBuilder.prototype.stream = function (file) {
        this._stream = file;
    };
    DefaultRequestBuilder.prototype.form = function (parameters, prefixFormat) {
        this._form = (0, queryString_1.filterFileWrapperFromKeyValuePairs)((0, queryString_1.formDataEncodeObject)(parameters, prefixFormat));
    };
    DefaultRequestBuilder.prototype.formData = function (parameters, prefixFormat) {
        this._formData = (0, queryString_1.formDataEncodeObject)(parameters, prefixFormat);
    };
    DefaultRequestBuilder.prototype.toRequest = function () {
        var request = {
            method: this._httpMethod,
            url: mergePath(this._baseUrlProvider(this._baseUrlArg), this._path),
        };
        if (this._query.length > 0) {
            var queryString = this._query.join('&');
            request.url +=
                (request.url.indexOf('?') === -1 ? '?' : '&') + queryString;
        }
        request.url = (0, apiHelper_1.sanitizeUrl)(request.url);
        // defensively copy headers
        var headers = tslib_1.__assign({}, this._headers);
        if (this._accept) {
            (0, httpHeaders_1.setHeader)(headers, httpHeaders_1.ACCEPT_HEADER, this._accept);
        }
        if (this._contentType) {
            (0, httpHeaders_1.setHeader)(headers, httpHeaders_1.CONTENT_TYPE_HEADER, this._contentType);
        }
        (0, httpHeaders_1.setHeader)(headers, httpHeaders_1.CONTENT_LENGTH_HEADER);
        request.headers = headers;
        if (this._body !== undefined) {
            request.body = { type: 'text', content: this._body };
        }
        else if (this._form !== undefined) {
            request.body = { type: 'form', content: this._form };
        }
        else if (this._formData !== undefined) {
            request.body = { type: 'form-data', content: this._formData };
        }
        else if (this._stream !== undefined) {
            request.body = { type: 'stream', content: this._stream };
        }
        return request;
    };
    DefaultRequestBuilder.prototype.intercept = function (interceptor) {
        this._interceptors.push(interceptor);
    };
    DefaultRequestBuilder.prototype.interceptRequest = function (interceptor) {
        this.intercept(function (req, opt, next) { return next(interceptor(req), opt); });
    };
    DefaultRequestBuilder.prototype.interceptResponse = function (interceptor) {
        var _this = this;
        this.intercept(function (req, opt, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a; return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = interceptor;
                    return [4 /*yield*/, next(req, opt)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); });
    };
    DefaultRequestBuilder.prototype.defaultToError = function (apiErrorCtor, message) {
        this._apiErrorFactory = { apiErrorCtor: apiErrorCtor, message: message };
    };
    DefaultRequestBuilder.prototype.validateResponse = function (validate) {
        this._validateResponse = validate;
    };
    DefaultRequestBuilder.prototype.throwOn = function (statusCode, errorConstructor, isTemplate) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        this._errorTypes.push({ statusCode: statusCode, errorConstructor: errorConstructor, isTemplate: isTemplate, args: args });
    };
    DefaultRequestBuilder.prototype.call = function (requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var pipeline, _a, request, response;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pipeline = (0, httpInterceptor_1.callHttpInterceptors)(this._interceptors, 
                        // tslint:disable-next-line:no-shadowed-variable
                        function (request, opt) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var response;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this._httpClient(request, opt)];
                                    case 1:
                                        response = _a.sent();
                                        return [2 /*return*/, { request: request, response: response }];
                                }
                            });
                        }); });
                        return [4 /*yield*/, pipeline(this.toRequest(), requestOptions)];
                    case 1:
                        _a = _b.sent(), request = _a.request, response = _a.response;
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, response), { request: request, result: undefined })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype.callAsText = function (requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call(requestOptions)];
                    case 1:
                        result = _a.sent();
                        if (typeof result.body !== 'string') {
                            throw new Error('Could not parse body as string.'); // TODO: Replace with SDK error
                        }
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: result.body })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype.callAsOptionalText = function (requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.call(requestOptions)];
                    case 1:
                        result = _a.sent();
                        if (typeof result.body !== 'string') {
                            return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: undefined })];
                        }
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: result.body })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype.callAsStream = function (requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.interceptRequest(function (req) { return (tslib_1.__assign(tslib_1.__assign({}, req), { responseType: 'stream' })); });
                        return [4 /*yield*/, this.call(requestOptions)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: (0, convert_to_stream_1.convertToStream)(result.body) })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype.callAsJson = function (schema, requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.interceptRequest(function (request) {
                            var headers = tslib_1.__assign({}, request.headers);
                            (0, httpHeaders_1.setHeaderIfNotSet)(headers, httpHeaders_1.ACCEPT_HEADER, httpHeaders_1.JSON_CONTENT_TYPE);
                            return tslib_1.__assign(tslib_1.__assign({}, request), { headers: headers });
                        });
                        return [4 /*yield*/, this.call(requestOptions)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: parseJsonResult(schema, result) })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype.callAsXml = function (rootName, schema, requestOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, xmlObject, error_1, mappingResult;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.interceptRequest(function (request) {
                            var headers = tslib_1.__assign({}, request.headers);
                            (0, httpHeaders_1.setHeaderIfNotSet)(headers, httpHeaders_1.ACCEPT_HEADER, httpHeaders_1.XML_CONTENT_TYPE);
                            return tslib_1.__assign(tslib_1.__assign({}, request), { headers: headers });
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
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this._xmlSerializer.xmlDeserialize(rootName, result.body)];
                    case 3:
                        xmlObject = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        throw new Error("Could not parse body as XML.\n\n".concat(error_1.message));
                    case 5:
                        mappingResult = (0, schema_1.validateAndMapXml)(xmlObject, schema);
                        if (mappingResult.errors) {
                            throw new responseValidationError_1.ResponseValidationError(result, mappingResult.errors);
                        }
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, result), { result: mappingResult.result })];
                }
            });
        });
    };
    DefaultRequestBuilder.prototype._setContentTypeIfNotSet = function (contentType) {
        if (!this._contentType) {
            (0, httpHeaders_1.setHeaderIfNotSet)(this._headers, httpHeaders_1.CONTENT_TYPE_HEADER, contentType);
        }
    };
    DefaultRequestBuilder.prototype._addResponseValidator = function () {
        var _this = this;
        this.interceptResponse(function (context) {
            var _a;
            var response = context.response;
            if (_this._validateResponse &&
                (response.statusCode < 200 || response.statusCode >= 300)) {
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
            this.intercept(function (request, options, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var context;
                return tslib_1.__generator(this, function (_a) {
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
            }); });
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
            return handler.apply(void 0, tslib_1.__spreadArray([], tslib_1.__read(args), false));
        });
    };
    DefaultRequestBuilder.prototype._addRetryInterceptor = function () {
        var _this = this;
        this.intercept(function (request, options, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var context, allowedWaitTime, retryCount, waitTime, timeoutError, shouldRetry, error_2;
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        allowedWaitTime = this._retryConfig.maximumRetryWaitTime;
                        retryCount = 0;
                        waitTime = 0;
                        shouldRetry = (0, retryConfiguration_1.shouldRetryRequest)(this._retryOption, this._retryConfig, this._httpMethod);
                        _c.label = 1;
                    case 1:
                        timeoutError = undefined;
                        if (!(retryCount > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, waitTime * 1000); })];
                    case 2:
                        _c.sent();
                        allowedWaitTime -= waitTime;
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
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
                            waitTime = (0, retryConfiguration_1.getRetryWaitTime)(this._retryConfig, allowedWaitTime, retryCount, (_a = context === null || context === void 0 ? void 0 : context.response) === null || _a === void 0 ? void 0 : _a.statusCode, (_b = context === null || context === void 0 ? void 0 : context.response) === null || _b === void 0 ? void 0 : _b.headers, timeoutError);
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
                        return [2 /*return*/, { request: request, response: context.response }];
                }
            });
        }); });
    };
    DefaultRequestBuilder.prototype._addErrorHandlingInterceptor = function () {
        var _this = this;
        this.interceptResponse(function (context) {
            var e_1, _a;
            var response = context.response;
            try {
                for (var _b = tslib_1.__values(_this
                    ._errorTypes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = _c.value, statusCode = _d.statusCode, errorConstructor = _d.errorConstructor, isTemplate = _d.isTemplate, args = _d.args;
                    if ((typeof statusCode === 'number' &&
                        response.statusCode === statusCode) ||
                        (typeof statusCode !== 'number' &&
                            response.statusCode >= statusCode[0] &&
                            response.statusCode <= statusCode[1])) {
                        if (isTemplate && args.length > 0) {
                            args[0] = (0, apiHelper_1.updateErrorMessage)(args[0], response);
                        }
                        throw new (errorConstructor.bind.apply(errorConstructor, tslib_1.__spreadArray([void 0, context], tslib_1.__read(args), false)))();
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return context;
        });
    };
    return DefaultRequestBuilder;
}());
exports.DefaultRequestBuilder = DefaultRequestBuilder;
function createRequestBuilderFactory(httpClient, baseUrlProvider, apiErrorConstructor, authenticationProvider, retryConfig, xmlSerializer, apiLogger) {
    if (xmlSerializer === void 0) { xmlSerializer = new xmlSerializer_1.XmlSerialization(); }
    return function (httpMethod, path) {
        return new DefaultRequestBuilder(httpClient, baseUrlProvider, apiErrorConstructor, authenticationProvider, httpMethod, xmlSerializer, retryConfig, path, apiLogger);
    };
}
exports.createRequestBuilderFactory = createRequestBuilderFactory;
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
        return validateJson(schema, null, function (_) { return resEmptyErr_1; });
    }
    var parsed;
    try {
        parsed = JSON.parse(res.body);
    }
    catch (error) {
        var resUnParseErr_1 = new Error("Could not parse body as JSON.\n\n".concat(error.message));
        return validateJson(schema, res.body, function (_) { return resUnParseErr_1; });
    }
    var resInvalidErr = function (errors) {
        return new responseValidationError_1.ResponseValidationError(res, errors);
    };
    return validateJson(schema, parsed, function (errors) { return resInvalidErr(errors); });
}
function validateJson(schema, value, errorCreater) {
    var mappingResult = (0, schema_1.validateAndMap)(value, schema);
    if (mappingResult.errors) {
        throw errorCreater(mappingResult.errors);
    }
    return mappingResult.result;
}
