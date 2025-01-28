import { HttpMethod } from './httpRequest';

/**
 * An interface for all configuration parameters needed for retrying in case of transient failures.
 */
export interface RetryConfiguration {
  /** Maximum number of retries. */
  maxNumberOfRetries: number;
  /** Whether to retry on request timeout. */
  retryOnTimeout: boolean;
  /**
   * Interval before next retry.
   * Used in calculation of wait time for next request in case of failure.
   */
  retryInterval: number;
  /** Overall wait time for the requests getting retried. */
  maximumRetryWaitTime: number;
  /** Used in calculation of wait time for next request in case of failure. */
  backoffFactor: number;
  /** Http status codes to retry against. */
  httpStatusCodesToRetry: number[];
  /** Http methods to retry against. */
  httpMethodsToRetry: HttpMethod[];
}
