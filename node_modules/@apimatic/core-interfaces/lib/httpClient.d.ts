import { HttpRequest, RequestOptions } from './httpRequest';
import { HttpResponse } from './httpResponse';
/**
 * Interface defining the contract for an HTTP client.
 * Implementations of this interface should handle making HTTP requests
 * and returning promises that resolve to HTTP responses.
 * @param request The HTTP request to be sent.
 * @param requestOptions Optional additional options for the request.
 * @returns A promise that resolves to an HTTP response.
 */
export type HttpClientInterface = (request: HttpRequest, requestOptions?: RequestOptions) => Promise<HttpResponse>;
//# sourceMappingURL=httpClient.d.ts.map