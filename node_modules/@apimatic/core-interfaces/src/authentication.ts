import { HttpInterceptorInterface } from './httpInterceptor';
import { RequestOptions } from './httpRequest';

export type AuthenticatorInterface<AuthParams> = (
  authParams?: AuthParams
) => HttpInterceptorInterface<RequestOptions | undefined>;
