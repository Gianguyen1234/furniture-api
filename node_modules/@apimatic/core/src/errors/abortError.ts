/**
 * Thrown when the API call is aborted by the caller.
 *
 * Note that when an AbortError is thrown, it is not a guarantee that the API call
 * did not go through.
 */
export class AbortError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
