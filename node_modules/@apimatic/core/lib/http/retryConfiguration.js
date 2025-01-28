"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRetryRequest = exports.getRetryWaitTime = exports.RequestRetryOption = void 0;
var httpHeaders_1 = require("./httpHeaders");
/**
 * An enum to override retries for any endpoint.
 */
var RequestRetryOption;
(function (RequestRetryOption) {
    RequestRetryOption[RequestRetryOption["Enable"] = 0] = "Enable";
    RequestRetryOption[RequestRetryOption["Disable"] = 1] = "Disable";
    RequestRetryOption[RequestRetryOption["Default"] = 2] = "Default";
})(RequestRetryOption = exports.RequestRetryOption || (exports.RequestRetryOption = {}));
/**
 * Returns wait time for the request
 * @param retryConfig Configuration for retry
 * @param method HttpMethod of the request
 * @param allowedWaitTime Remaining allowed wait time
 * @param retryCount Retry attempt number
 * @param httpCode Status code received
 * @param headers Response headers
 * @param timeoutError Error from the server
 * @returns Wait time before the retry
 */
function getRetryWaitTime(retryConfig, allowedWaitTime, retryCount, httpCode, headers, timeoutError) {
    var retryWaitTime = 0.0;
    var retry = false;
    var retryAfter = 0;
    if (retryCount < retryConfig.maxNumberOfRetries) {
        if (timeoutError) {
            retry = retryConfig.retryOnTimeout;
        }
        else if (typeof headers !== 'undefined' &&
            typeof httpCode !== 'undefined') {
            retryAfter = getRetryAfterSeconds((0, httpHeaders_1.getHeader)(headers, 'retry-after'));
            retry =
                retryAfter > 0 || retryConfig.httpStatusCodesToRetry.includes(httpCode);
        }
        if (retry) {
            var noise = +(Math.random() / 100).toFixed(3);
            var waitTime = retryConfig.retryInterval *
                Math.pow(retryConfig.backoffFactor, retryCount) +
                noise;
            waitTime = Math.max(waitTime, retryAfter);
            if (waitTime <= allowedWaitTime) {
                retryWaitTime = waitTime;
            }
        }
    }
    return retryWaitTime;
}
exports.getRetryWaitTime = getRetryWaitTime;
function getRetryAfterSeconds(retryAfter) {
    if (retryAfter == null) {
        return 0;
    }
    if (isNaN(+retryAfter)) {
        var timeDifference = (new Date(retryAfter).getTime() - Date.now()) / 1000;
        return isNaN(timeDifference) ? 0 : timeDifference;
    }
    return +retryAfter;
}
function shouldRetryRequest(retryOption, retryConfig, httpMethod) {
    switch (retryOption) {
        case RequestRetryOption.Default:
            return retryConfig !== undefined && httpMethod !== undefined
                ? retryConfig.httpMethodsToRetry.includes(httpMethod)
                : false;
        case RequestRetryOption.Enable:
            return true;
        case RequestRetryOption.Disable:
            return false;
    }
}
exports.shouldRetryRequest = shouldRetryRequest;
