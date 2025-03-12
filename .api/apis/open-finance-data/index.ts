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
   * Get a user's open banking report
   *
   */
  getDataMonthlyReportUserid(metadata: types.GetDataMonthlyReportUseridMetadataParam): Promise<FetchResponse<200, types.GetDataMonthlyReportUseridResponse200>> {
    return this.core.fetch('/data/monthly-report/{userId}', 'get', metadata);
  }

  /**
   * Get all providers
   *
   * @throws FetchError<404, types.GetProvidersResponse404> Not found - no providers were found or organization not found
   */
  getProviders(metadata?: types.GetProvidersMetadataParam): Promise<FetchResponse<200, types.GetProvidersResponse200>> {
    return this.core.fetch('/providers', 'get', metadata);
  }

  /**
   * Get all bank branches
   *
   */
  getBankBranches(metadata: types.GetBankBranchesMetadataParam): Promise<FetchResponse<200, types.GetBankBranchesResponse200>> {
    return this.core.fetch('/bank-branches', 'get', metadata);
  }

  /**
   * Create account verification report
   *
   * @throws FetchError<400, types.PostAccountVerificationResponse400> Invalid request format or parameters, or validation error for orgId or userId
   */
  postAccountVerification(body: types.PostAccountVerificationBodyParam): Promise<FetchResponse<200, types.PostAccountVerificationResponse200>> {
    return this.core.fetch('/account-verification', 'post', body);
  }

  /**
   * Get user account verification reports
   *
   * @throws FetchError<400, types.GetAccountVerificationResponse400> Validation error - orgId was not provided
   */
  getAccountVerification(): Promise<FetchResponse<200, types.GetAccountVerificationResponse200>> {
    return this.core.fetch('/account-verification', 'get');
  }

  /**
   * Check if a certain account is restricted
   *
   * @throws FetchError<400, types.PostAccountNumberVerificationResponse400> Invalid request format or parameters
   */
  postAccountNumberVerification(body: types.PostAccountNumberVerificationBodyParam): Promise<FetchResponse<200, types.PostAccountNumberVerificationResponse200>> {
    return this.core.fetch('/account-number-verification', 'post', body);
  }

  /**
   * Refund a payment
   *
   * @throws FetchError<400, types.PostPaymentsPaymentidRefundResponse400> Invalid request format or parameters
   */
  postPaymentsPaymentidRefund(body: types.PostPaymentsPaymentidRefundBodyParam, metadata: types.PostPaymentsPaymentidRefundMetadataParam): Promise<FetchResponse<200, types.PostPaymentsPaymentidRefundResponse200>> {
    return this.core.fetch('/payments/{paymentId}/refund', 'post', body, metadata);
  }

  /**
   * Get users by ids
   *
   * @throws FetchError<400, types.PostAggregationsResponse400> No id or segmentType were found
   */
  postAggregations(body: types.PostAggregationsBodyParam): Promise<FetchResponse<200, types.PostAggregationsResponse200>> {
    return this.core.fetch('/aggregations', 'post', body);
  }

  /**
   * Send financial data by email
   *
   * @throws FetchError<400, types.PostAggregateFinancialDataEmailResponse400> Missing detailsToShare or email in request body
   */
  postAggregateFinancialDataEmail(body: types.PostAggregateFinancialDataEmailBodyParam): Promise<FetchResponse<200, types.PostAggregateFinancialDataEmailResponse200>> {
    return this.core.fetch('/aggregate/financial-data-email', 'post', body);
  }

  /**
   * Send a link via whatsapp message
   *
   * @throws FetchError<400, types.PostCompletionWhIncomingResponse400> Missing Body or From in request body
   */
  postCompletionWhIncoming(body: types.PostCompletionWhIncomingBodyParam): Promise<FetchResponse<200, types.PostCompletionWhIncomingResponse200>> {
    return this.core.fetch('/completion/wh/incoming', 'post', body);
  }

  /**
   * Initiate a connection to open banking
   *
   * @throws FetchError<400, types.PostConnectOpenBankingInitResponse400> the provider does not match the connection settings
   */
  postConnectOpenBankingInit(body: types.PostConnectOpenBankingInitBodyParam): Promise<FetchResponse<200, types.PostConnectOpenBankingInitResponse200>> {
    return this.core.fetch('/connect/open-banking-init', 'post', body);
  }

  /**
   * Finalize a connection to open banking
   *
   * @throws FetchError<400, types.GetConnectOpenBankingFinalizeResponse400> state is required
   */
  getConnectOpenBankingFinalize(metadata: types.GetConnectOpenBankingFinalizeMetadataParam): Promise<FetchResponse<200, types.GetConnectOpenBankingFinalizeResponse200>> {
    return this.core.fetch('/connect/open-banking-finalize', 'get', metadata);
  }

  /**
   * Create payment
   *
   * @throws FetchError<400, types.PostPaymentsResponse400> Bad request - Possible validation errors or missing required fields.
   * @throws FetchError<401, types.PostPaymentsResponse401> Unauthorized - Invalid or missing access token
   * @throws FetchError<404, types.PostPaymentsResponse404> Not found - Merchant or token-related issues
   * @throws FetchError<500, types.PostPaymentsResponse500> Internal server error
   */
  postPayments(body: types.PostPaymentsBodyParam): Promise<FetchResponse<201, types.PostPaymentsResponse201>> {
    return this.core.fetch('/payments', 'post', body);
  }

  /**
   * Get payments by user
   *
   */
  getPayments(metadata?: types.GetPaymentsMetadataParam): Promise<FetchResponse<200, types.GetPaymentsResponse200>> {
    return this.core.fetch('/payments', 'get', metadata);
  }

  /**
   * Update sandbox payment status
   *
   * @throws FetchError<400, types.PatchPaymentsSandboxPaymentidResponse400> Bad request - Possible validation errors or missing required fields.
   * @throws FetchError<401, types.PatchPaymentsSandboxPaymentidResponse401> Unauthorized - Invalid or missing access token
   * @throws FetchError<404, types.PatchPaymentsSandboxPaymentidResponse404> Not found - Merchant or token-related issues
   * @throws FetchError<500, types.PatchPaymentsSandboxPaymentidResponse500> Internal server error
   */
  patchPaymentsSandboxPaymentid(body: types.PatchPaymentsSandboxPaymentidBodyParam, metadata: types.PatchPaymentsSandboxPaymentidMetadataParam): Promise<FetchResponse<200, types.PatchPaymentsSandboxPaymentidResponse200>> {
    return this.core.fetch('/payments/sandbox/{paymentId}', 'patch', body, metadata);
  }

  /**
   * Get payment by ID
   *
   * @throws FetchError<400, types.GetPaymentsPaymentidResponse400> Bad request - Missing orgId or invalid request
   * @throws FetchError<401, types.GetPaymentsPaymentidResponse401> Unauthorized - Invalid or missing access token
   * @throws FetchError<404, types.GetPaymentsPaymentidResponse404> Not found - Payment or provider not found
   * @throws FetchError<500, types.GetPaymentsPaymentidResponse500> Internal server error
   */
  getPaymentsPaymentid(metadata: types.GetPaymentsPaymentidMetadataParam): Promise<FetchResponse<200, types.GetPaymentsPaymentidResponse200>> {
    return this.core.fetch('/payments/{paymentId}', 'get', metadata);
  }

  /**
   * Get the list of positions and orders with extra information
   *
   */
  getDataExtendedSecurities(): Promise<FetchResponse<200, types.GetDataExtendedSecuritiesResponse200>> {
    return this.core.fetch('/data/extended-securities', 'get');
  }

  /**
   * Get payment status
   *
   * @throws FetchError<400, types.GetPaymentsPaymentidStatusResponse400> Bad request - Possible validation or client errors
   * @throws FetchError<401, types.GetPaymentsPaymentidStatusResponse401> Unauthorized - Invalid or missing access token
   * @throws FetchError<404, types.GetPaymentsPaymentidStatusResponse404> Not found - Payment or provider not found
   * @throws FetchError<500, types.GetPaymentsPaymentidStatusResponse500> Internal server error
   */
  getPaymentsPaymentidStatus(metadata: types.GetPaymentsPaymentidStatusMetadataParam): Promise<FetchResponse<200, types.GetPaymentsPaymentidStatusResponse200>> {
    return this.core.fetch('/payments/{paymentId}/status', 'get', metadata);
  }

  /**
   * Initiate a payment with a provider
   *
   * @throws FetchError<400, types.PostPayOpenBankingInitResponse400> Bad Request - The request could not be processed due to multiple possible reasons.
   * @throws FetchError<401, types.PostPayOpenBankingInitResponse401> Unauthorized access - Invalid or missing access token
   * @throws FetchError<404, types.PostPayOpenBankingInitResponse404> Not found - Payment or provider not found
   * @throws FetchError<500, types.PostPayOpenBankingInitResponse500> Internal server error
   */
  postPayOpenBankingInit(body: types.PostPayOpenBankingInitBodyParam): Promise<FetchResponse<201, types.PostPayOpenBankingInitResponse201>> {
    return this.core.fetch('/pay/open-banking-init', 'post', body);
  }

  /**
   * Generates an ATM code for a specified payment
   *
   * @throws FetchError<400, types.PostAtmGenerateResponse400> Payment is not in a successful status
   * @throws FetchError<404, types.PostAtmGenerateResponse404> Payment not found or invalid token
   * @throws FetchError<500, types.PostAtmGenerateResponse500> Internal server error
   */
  postAtmGenerate(body: types.PostAtmGenerateBodyParam): Promise<FetchResponse<201, types.PostAtmGenerateResponse201>> {
    return this.core.fetch('/atm/generate', 'post', body);
  }

  /**
   * Verifies an ATM code
   *
   * @throws FetchError<400, types.PostAtmVerifyResponse400> ATM code not found or is invalid
   * @throws FetchError<404, types.PostAtmVerifyResponse404> ATM code not found or is invalid
   * @throws FetchError<500, types.PostAtmVerifyResponse500> Internal server error
   */
  postAtmVerify(body: types.PostAtmVerifyBodyParam): Promise<FetchResponse<200, types.PostAtmVerifyResponse200>> {
    return this.core.fetch('/atm/verify', 'post', body);
  }

  /**
   * Create a financial report to a customer
   *
   * @throws FetchError<400, types.PostFinancialReportCustomeridResponse400> Error getting financial report
   * @throws FetchError<500, types.PostFinancialReportCustomeridResponse500> Internal server error
   */
  postFinancialReportCustomerid(metadata: types.PostFinancialReportCustomeridMetadataParam): Promise<FetchResponse<200, types.PostFinancialReportCustomeridResponse200>> {
    return this.core.fetch('/financial-report/{customerId}', 'post', metadata);
  }

  /**
   * Get a financial report by jobId
   *
   * @throws FetchError<400, types.GetFinancialReportJobidResponse400> Error getting financial report
   * @throws FetchError<500, types.GetFinancialReportJobidResponse500> Internal server error
   */
  getFinancialReportJobid(metadata: types.GetFinancialReportJobidMetadataParam): Promise<FetchResponse<200, types.GetFinancialReportJobidResponse200>> {
    return this.core.fetch('/financial-report/{jobId}', 'get', metadata);
  }

  /**
   * Create a decision report to a customer
   *
   * @throws FetchError<400, types.PostDecisionCustomeridResponse400> Error getting financial report
   * @throws FetchError<500, types.PostDecisionCustomeridResponse500> Internal server error
   */
  postDecisionCustomerid(metadata: types.PostDecisionCustomeridMetadataParam): Promise<FetchResponse<200, types.PostDecisionCustomeridResponse200>> {
    return this.core.fetch('/decision/{customerId}', 'post', metadata);
  }

  /**
   * Get decision by jobId
   *
   * @throws FetchError<400, types.GetDecisionJobidResponse400> Error getting deciosion report
   * @throws FetchError<500, types.GetDecisionJobidResponse500> Internal server error
   */
  getDecisionJobid(metadata: types.GetDecisionJobidMetadataParam): Promise<FetchResponse<200, types.GetDecisionJobidResponse200>> {
    return this.core.fetch('/decision/{jobId}', 'get', metadata);
  }

  /**
   * Create connection
   *
   * @throws FetchError<400, types.PostConnectionsResponse400> production access is not enabled for this organization, you must include fake providers
   * or contact us
   */
  postConnections(body: types.PostConnectionsBodyParam): Promise<FetchResponse<201, types.PostConnectionsResponse201>> {
    return this.core.fetch('/connections', 'post', body);
  }

  /**
   * Get connections by user
   *
   * @throws FetchError<400, types.GetConnectionsResponse400> userId is not allowed in query for non-admin users
   */
  getConnections(metadata?: types.GetConnectionsMetadataParam): Promise<FetchResponse<200, types.GetConnectionsResponse200>> {
    return this.core.fetch('/connections', 'get', metadata);
  }

  /**
   * Get connection by ID
   *
   * @throws FetchError<400, types.GetConnectionsConnectionidResponse400> orgId was not provided
   */
  getConnectionsConnectionid(metadata: types.GetConnectionsConnectionidMetadataParam): Promise<FetchResponse<200, types.GetConnectionsConnectionidResponse200>> {
    return this.core.fetch('/connections/{connectionId}', 'get', metadata);
  }

  /**
   * Delete connection by ID (user scope)
   *
   * @throws FetchError<400, types.DeleteConnectionsConnectionidResponse400> userId is not allowed in query for non-admin users
   */
  deleteConnectionsConnectionid(metadata: types.DeleteConnectionsConnectionidMetadataParam): Promise<FetchResponse<204, types.DeleteConnectionsConnectionidResponse204>> {
    return this.core.fetch('/connections/{connectionId}', 'delete', metadata);
  }

  /**
   * Refresh all connections data by user ID
   *
   * @throws FetchError<400, types.GetConnectionsUseridRefreshResponse400> userId missing from params
   */
  getConnectionsUseridRefresh(metadata: types.GetConnectionsUseridRefreshMetadataParam): Promise<FetchResponse<204, types.GetConnectionsUseridRefreshResponse204>> {
    return this.core.fetch('/connections/{userId}/refresh', 'get', metadata);
  }

  /**
   * Refresh a connection by its id
   *
   * @throws FetchError<400, types.GetConnectionsRefreshConnectionidResponse400> connectionId missing from params
   */
  getConnectionsRefreshConnectionid(metadata: types.GetConnectionsRefreshConnectionidMetadataParam): Promise<FetchResponse<204, types.GetConnectionsRefreshConnectionidResponse204>> {
    return this.core.fetch('/connections/refresh/{connectionId}', 'get', metadata);
  }

  /**
   * Get accounts by user
   *
   * @throws FetchError<400, types.GetDataAccountsResponse400> orgId was not provided
   */
  getDataAccounts(metadata?: types.GetDataAccountsMetadataParam): Promise<FetchResponse<200, types.GetDataAccountsResponse200>> {
    return this.core.fetch('/data/accounts', 'get', metadata);
  }

  /**
   * Get account by ID
   *
   * @throws FetchError<400, types.GetDataAccountsAccountidResponse400> orgId was not provided
   */
  getDataAccountsAccountid(metadata: types.GetDataAccountsAccountidMetadataParam): Promise<FetchResponse<200, types.GetDataAccountsAccountidResponse200>> {
    return this.core.fetch('/data/accounts/{accountId}', 'get', metadata);
  }

  /**
   * Get transactions by user
   *
   */
  getDataTransactions(metadata?: types.GetDataTransactionsMetadataParam): Promise<FetchResponse<200, types.GetDataTransactionsResponse200>> {
    return this.core.fetch('/data/transactions', 'get', metadata);
  }

  /**
   * Get transactions by ID
   *
   */
  getDataTransactionsSk(metadata: types.GetDataTransactionsSkMetadataParam): Promise<FetchResponse<200, types.GetDataTransactionsSkResponse200>> {
    return this.core.fetch('/data/transactions/{SK}', 'get', metadata);
  }

  /**
   * Update a transaction by ID
   *
   */
  patchDataTransactionsSk(body: types.PatchDataTransactionsSkBodyParam, metadata: types.PatchDataTransactionsSkMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/data/transactions/{SK}', 'patch', body, metadata);
  }

  /**
   * Get all merchants
   *
   */
  getMerchants(metadata?: types.GetMerchantsMetadataParam): Promise<FetchResponse<200, types.GetMerchantsResponse200>> {
    return this.core.fetch('/merchants', 'get', metadata);
  }

  /**
   * Create a merchant
   *
   * @throws FetchError<400, types.PostMerchantsResponse400> Invalid request format or invalid body
   */
  postMerchants(body: types.PostMerchantsBodyParam): Promise<FetchResponse<201, types.PostMerchantsResponse201>> {
    return this.core.fetch('/merchants', 'post', body);
  }

  /**
   * Update a merchant
   *
   * @throws FetchError<400, types.PutMerchantsMerchantidResponse400> Invalid request format or parameters
   */
  putMerchantsMerchantid(body: types.PutMerchantsMerchantidBodyParam, metadata: types.PutMerchantsMerchantidMetadataParam): Promise<FetchResponse<200, types.PutMerchantsMerchantidResponse200>> {
    return this.core.fetch('/merchants/{merchantId}', 'put', body, metadata);
  }

  /**
   * Get merchant by id
   *
   */
  getMerchantsMerchantid(metadata: types.GetMerchantsMerchantidMetadataParam): Promise<FetchResponse<200, types.GetMerchantsMerchantidResponse200>> {
    return this.core.fetch('/merchants/{merchantId}', 'get', metadata);
  }

  /**
   * Delete merchant by ID
   *
   */
  deleteMerchantsMerchantid(metadata: types.DeleteMerchantsMerchantidMetadataParam): Promise<FetchResponse<204, types.DeleteMerchantsMerchantidResponse204>> {
    return this.core.fetch('/merchants/{merchantId}', 'delete', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { DeleteConnectionsConnectionidMetadataParam, DeleteConnectionsConnectionidResponse204, DeleteConnectionsConnectionidResponse400, DeleteMerchantsMerchantidMetadataParam, DeleteMerchantsMerchantidResponse204, GetAccountVerificationResponse200, GetAccountVerificationResponse400, GetBankBranchesMetadataParam, GetBankBranchesResponse200, GetConnectOpenBankingFinalizeMetadataParam, GetConnectOpenBankingFinalizeResponse200, GetConnectOpenBankingFinalizeResponse400, GetConnectionsConnectionidMetadataParam, GetConnectionsConnectionidResponse200, GetConnectionsConnectionidResponse400, GetConnectionsMetadataParam, GetConnectionsRefreshConnectionidMetadataParam, GetConnectionsRefreshConnectionidResponse204, GetConnectionsRefreshConnectionidResponse400, GetConnectionsResponse200, GetConnectionsResponse400, GetConnectionsUseridRefreshMetadataParam, GetConnectionsUseridRefreshResponse204, GetConnectionsUseridRefreshResponse400, GetDataAccountsAccountidMetadataParam, GetDataAccountsAccountidResponse200, GetDataAccountsAccountidResponse400, GetDataAccountsMetadataParam, GetDataAccountsResponse200, GetDataAccountsResponse400, GetDataExtendedSecuritiesResponse200, GetDataMonthlyReportUseridMetadataParam, GetDataMonthlyReportUseridResponse200, GetDataTransactionsMetadataParam, GetDataTransactionsResponse200, GetDataTransactionsSkMetadataParam, GetDataTransactionsSkResponse200, GetDecisionJobidMetadataParam, GetDecisionJobidResponse200, GetDecisionJobidResponse400, GetDecisionJobidResponse500, GetFinancialReportJobidMetadataParam, GetFinancialReportJobidResponse200, GetFinancialReportJobidResponse400, GetFinancialReportJobidResponse500, GetMerchantsMerchantidMetadataParam, GetMerchantsMerchantidResponse200, GetMerchantsMetadataParam, GetMerchantsResponse200, GetPaymentsMetadataParam, GetPaymentsPaymentidMetadataParam, GetPaymentsPaymentidResponse200, GetPaymentsPaymentidResponse400, GetPaymentsPaymentidResponse401, GetPaymentsPaymentidResponse404, GetPaymentsPaymentidResponse500, GetPaymentsPaymentidStatusMetadataParam, GetPaymentsPaymentidStatusResponse200, GetPaymentsPaymentidStatusResponse400, GetPaymentsPaymentidStatusResponse401, GetPaymentsPaymentidStatusResponse404, GetPaymentsPaymentidStatusResponse500, GetPaymentsResponse200, GetProvidersMetadataParam, GetProvidersResponse200, GetProvidersResponse404, PatchDataTransactionsSkBodyParam, PatchDataTransactionsSkMetadataParam, PatchPaymentsSandboxPaymentidBodyParam, PatchPaymentsSandboxPaymentidMetadataParam, PatchPaymentsSandboxPaymentidResponse200, PatchPaymentsSandboxPaymentidResponse400, PatchPaymentsSandboxPaymentidResponse401, PatchPaymentsSandboxPaymentidResponse404, PatchPaymentsSandboxPaymentidResponse500, PostAccountNumberVerificationBodyParam, PostAccountNumberVerificationResponse200, PostAccountNumberVerificationResponse400, PostAccountVerificationBodyParam, PostAccountVerificationResponse200, PostAccountVerificationResponse400, PostAggregateFinancialDataEmailBodyParam, PostAggregateFinancialDataEmailResponse200, PostAggregateFinancialDataEmailResponse400, PostAggregationsBodyParam, PostAggregationsResponse200, PostAggregationsResponse400, PostAtmGenerateBodyParam, PostAtmGenerateResponse201, PostAtmGenerateResponse400, PostAtmGenerateResponse404, PostAtmGenerateResponse500, PostAtmVerifyBodyParam, PostAtmVerifyResponse200, PostAtmVerifyResponse400, PostAtmVerifyResponse404, PostAtmVerifyResponse500, PostCompletionWhIncomingBodyParam, PostCompletionWhIncomingResponse200, PostCompletionWhIncomingResponse400, PostConnectOpenBankingInitBodyParam, PostConnectOpenBankingInitResponse200, PostConnectOpenBankingInitResponse400, PostConnectionsBodyParam, PostConnectionsResponse201, PostConnectionsResponse400, PostDecisionCustomeridMetadataParam, PostDecisionCustomeridResponse200, PostDecisionCustomeridResponse400, PostDecisionCustomeridResponse500, PostFinancialReportCustomeridMetadataParam, PostFinancialReportCustomeridResponse200, PostFinancialReportCustomeridResponse400, PostFinancialReportCustomeridResponse500, PostMerchantsBodyParam, PostMerchantsResponse201, PostMerchantsResponse400, PostPayOpenBankingInitBodyParam, PostPayOpenBankingInitResponse201, PostPayOpenBankingInitResponse400, PostPayOpenBankingInitResponse401, PostPayOpenBankingInitResponse404, PostPayOpenBankingInitResponse500, PostPaymentsBodyParam, PostPaymentsPaymentidRefundBodyParam, PostPaymentsPaymentidRefundMetadataParam, PostPaymentsPaymentidRefundResponse200, PostPaymentsPaymentidRefundResponse400, PostPaymentsResponse201, PostPaymentsResponse400, PostPaymentsResponse401, PostPaymentsResponse404, PostPaymentsResponse500, PutMerchantsMerchantidBodyParam, PutMerchantsMerchantidMetadataParam, PutMerchantsMerchantidResponse200, PutMerchantsMerchantidResponse400 } from './types';
