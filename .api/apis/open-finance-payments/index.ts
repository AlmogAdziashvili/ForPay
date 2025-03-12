import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'open-finance/1.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Create payment request
   *
   * @throws FetchError<400, types.PostPayOpenBankingInitResponse400> Validation Error
   * @throws FetchError<401, types.PostPayOpenBankingInitResponse401> Unauthorized, token is missing
   * @throws FetchError<403, types.PostPayOpenBankingInitResponse403> Forbidden, token has no valid scopes
   * @throws FetchError<500, types.PostPayOpenBankingInitResponse500> Internal Server Error
   */
  postPayOpenBankingInit(body: types.PostPayOpenBankingInitBodyParam): Promise<FetchResponse<201, types.PostPayOpenBankingInitResponse201>> {
    return this.core.fetch('/pay/open-banking-init', 'post', body);
  }

  /**
   * Get payment for user
   *
   * @throws FetchError<400, types.GetPaymentsResponse400> Validation Error
   * @throws FetchError<401, types.GetPaymentsResponse401> Unauthorized, token is missing
   * @throws FetchError<403, types.GetPaymentsResponse403> Forbidden, token has no valid scopes
   * @throws FetchError<404, types.GetPaymentsResponse404> Not Found, No payments found for user
   * @throws FetchError<500, types.GetPaymentsResponse500> Internal Server Error
   */
  getPayments(): Promise<FetchResponse<200, types.GetPaymentsResponse200>> {
    return this.core.fetch('/payments', 'get');
  }

  /**
   * Get payment by id
   *
   * @throws FetchError<400, types.GetPaymentsPaymentidResponse400> Validation Error
   * @throws FetchError<401, types.GetPaymentsPaymentidResponse401> Unauthorized, token is missing
   * @throws FetchError<403, types.GetPaymentsPaymentidResponse403> Forbidden, token has no valid scopes
   * @throws FetchError<404, types.GetPaymentsPaymentidResponse404> Not Found, Payment with this Id not found
   * @throws FetchError<500, types.GetPaymentsPaymentidResponse500> Internal Server Error
   */
  getPaymentsPaymentid(metadata: types.GetPaymentsPaymentidMetadataParam): Promise<FetchResponse<200, types.GetPaymentsPaymentidResponse200>> {
    return this.core.fetch('/payments/{paymentId}', 'get', metadata);
  }

  /**
   * Get payment by id with live status
   *
   * @throws FetchError<400, types.GetPaymentsPaymentidStatusResponse400> Validation Error
   * @throws FetchError<401, types.GetPaymentsPaymentidStatusResponse401> Unauthorized, token is missing
   * @throws FetchError<403, types.GetPaymentsPaymentidStatusResponse403> Forbidden, token has no valid scopes
   * @throws FetchError<404, types.GetPaymentsPaymentidStatusResponse404> Not Found, Payment with this Id not found
   * @throws FetchError<500, types.GetPaymentsPaymentidStatusResponse500> Internal Server Error
   */
  getPaymentsPaymentidStatus(metadata: types.GetPaymentsPaymentidStatusMetadataParam): Promise<FetchResponse<200, types.GetPaymentsPaymentidStatusResponse200>> {
    return this.core.fetch('/payments/{paymentId}/status', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { GetPaymentsPaymentidMetadataParam, GetPaymentsPaymentidResponse200, GetPaymentsPaymentidResponse400, GetPaymentsPaymentidResponse401, GetPaymentsPaymentidResponse403, GetPaymentsPaymentidResponse404, GetPaymentsPaymentidResponse500, GetPaymentsPaymentidStatusMetadataParam, GetPaymentsPaymentidStatusResponse200, GetPaymentsPaymentidStatusResponse400, GetPaymentsPaymentidStatusResponse401, GetPaymentsPaymentidStatusResponse403, GetPaymentsPaymentidStatusResponse404, GetPaymentsPaymentidStatusResponse500, GetPaymentsResponse200, GetPaymentsResponse400, GetPaymentsResponse401, GetPaymentsResponse403, GetPaymentsResponse404, GetPaymentsResponse500, PostPayOpenBankingInitBodyParam, PostPayOpenBankingInitResponse201, PostPayOpenBankingInitResponse400, PostPayOpenBankingInitResponse401, PostPayOpenBankingInitResponse403, PostPayOpenBankingInitResponse500 } from './types';
