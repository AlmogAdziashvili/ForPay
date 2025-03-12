import { Router } from 'express';
import openFinance from '@api/open-finance-auth';
import openFinanceData from '@api/open-finance-data';
import openFinancePayments from '@api/open-finance-payments';
import { logger } from './logger.js';

let token: string | null = null;
let tokenExpiration: number | null = null;

async function getToken() {
    if (token && tokenExpiration && tokenExpiration > Date.now()) {
        return token;
    }
    const res = await openFinance.default.postToken({ userId: process.env.OF_USER_ID!, clientId: process.env.OF_CLIENT_ID!, clientSecret: process.env.OF_CLIENT_SECRET! });
    if (res.data.accessToken) {
        token = res.data.accessToken;
        logger.info('Token refreshed');
        tokenExpiration = Date.now() + res.data.expiresIn!;
        return token;
    }
    return token || '';
}

const transferRouter = Router();

transferRouter.get('/providers', async (req, res) => {
    const sdk = openFinanceData.default.auth(await getToken());
    const providersResponse = await sdk.getProviders();
    return res.json(providersResponse.data.filter((provider) => !!provider.bankCode).sort((a, b) => (a.sortIndex || 99) - (b.sortIndex || 99)));
});

transferRouter.post('/deposit', async (req, res) => {
    const { providerIdentifier, providerId, bban, amount, branch } = req.body;
    const sdk = openFinancePayments.default.auth(await getToken());
    if (!req.session.user?.identificationNumber) {
        return res.sendStatus(401);
    }
    console.log(JSON.stringify({
        providerId: providerIdentifier, psuId: req.session.user.identificationNumber.toString(), paymentInformation: {
            amount,
            creditorAccountNumber: process.env.OF_CREDITOR_ACCOUNT_NUMBER!,
            creditorAccountType: 'bban',
            creditorName: process.env.OF_CREDITOR_NAME!,
            currency: 'ILS',
            debtorAccountNumber: `${providerId}-${branch}-${bban}`,
            debtorAccountType: 'bban',
            description: 'Deposit',
        }
    }, null, 2));
    const transferResponse = await sdk.postPayOpenBankingInit({
        providerId: providerIdentifier, psuId: req.session.user.identificationNumber.toString(), paymentInformation: {
            amount,
            creditorAccountNumber: process.env.OF_CREDITOR_ACCOUNT_NUMBER!,
            creditorAccountType: 'bban',
            creditorName: process.env.OF_CREDITOR_NAME!,
            currency: 'ILS',
            debtorAccountNumber: `${providerId}-${branch}-${bban}`,
            debtorAccountType: 'bban',
            description: 'Deposit',
        }
    });
    return res.json(transferResponse.data.scaOAuth);
});

export { transferRouter };