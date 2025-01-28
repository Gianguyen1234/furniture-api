import { bigint, object, optional, Schema, string } from '@apimatic/schema';

/** OAuth 2 Authorization endpoint response */
export interface OAuthToken {
  /** Access token */
  accessToken: string;
  /** Type of access token */
  tokenType: string;
  /** Time in seconds before the access token expires */
  expiresIn?: bigint;
  /**
   * List of scopes granted
   * This is a space-delimited list of strings.
   */
  scope?: string;
  /** Time of token expiry as unix timestamp (UTC) */
  expiry?: bigint;
  /**
   * Refresh token
   * Used to get a new access token when it expires.
   */
  refreshToken?: string;
}

export const oAuthTokenSchema: Schema<OAuthToken> = object({
  accessToken: ['access_token', string()],
  tokenType: ['token_type', string()],
  expiresIn: ['expires_in', optional(bigint())],
  scope: ['scope', optional(string())],
  expiry: ['expiry', optional(bigint())],
  refreshToken: ['refresh_token', optional(string())],
});
