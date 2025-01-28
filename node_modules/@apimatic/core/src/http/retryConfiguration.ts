import { getHeader } from './httpHeaders';
import { HttpMethod, RetryConfiguration } from '../coreInterfaces';

/**
 * An enum to override retries for any endpoint.
 */
export enum RequestRetryOption {
  Enable,
  Disable,
  Default,
}

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
export function getRetryWaitTime(
  retryConfig: RetryConfiguration,
  allowedWaitTime: number,
  retryCount: number,
  httpCode?: number,
  headers?: Record<string, string>,
  timeoutError?: Error
): number {
  let retryWaitTime = 0.0;
  let retry = false;
  let retryAfter = 0;
  if (retryCount < retryConfig.maxNumberOfRetries) {
    if (timeoutError) {
      retry = retryConfig.retryOnTimeout;
    } else if (
      typeof headers !== 'undefined' &&
      typeof httpCode !== 'undefined'
    ) {
      retryAfter = getRetryAfterSeconds(getHeader(headers, 'retry-after'));
      retry =
        retryAfter > 0 || retryConfig.httpStatusCodesToRetry.includes(httpCode);
    }

    if (retry) {
      const noise = +(Math.random() / 100).toFixed(3);
      let waitTime =
        retryConfig.retryInterval *
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

function getRetryAfterSeconds(retryAfter: string | null): number {
  if (retryAfter == null) {
    return 0;
  }
  if (isNaN(+retryAfter)) {
    const timeDifference = (new Date(retryAfter).getTime() - Date.now()) / 1000;
    return isNaN(timeDifference) ? 0 : timeDifference;
  }
  return +retryAfter;
}

export function shouldRetryRequest(
  retryOption: RequestRetryOption,
  retryConfig?: RetryConfiguration,
  httpMethod?: HttpMethod
): boolean {
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
