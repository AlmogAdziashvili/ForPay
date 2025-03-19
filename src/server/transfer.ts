import { Router } from 'express';
import openFinance from '@api/open-finance-auth';
import openFinanceData from '@api/open-finance-data';
import { logger } from './logger.js';
import axios from 'axios';
import Deposit from './models/deposit.js';
import Wallet from './models/wallet.js';
import { sendTelegramMessage } from './telegram.js';

let token: string | null = null;
let tokenExpiration: number | null = null;

async function getToken() {
  if (token && tokenExpiration && tokenExpiration > Date.now()) {
    return token;
  }
  const res = await openFinance.default.postToken({
    userId: process.env.OF_USER_ID!,
    clientId: process.env.OF_CLIENT_ID!,
    clientSecret: process.env.OF_CLIENT_SECRET!,
  });
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
  return res.json(
    providersResponse.data
      .filter((provider) => !!provider.bankCode)
      .sort((a, b) => (a.sortIndex || 99) - (b.sortIndex || 99))
  );
});

transferRouter.post('/deposit', async (req, res) => {
  const { providerIdentifier, providerId, bban, amount, branch } = req.body;
  if (!req.session.user?.identificationNumber) {
    return res.sendStatus(401);
  }

  if (!providerIdentifier || !providerId || !bban || !amount || amount <= 0) {
    return res.sendStatus(400);
  }

  const { data } = await axios.post(
    'https://api.open-finance.ai/v2/pay/open-banking-init',
    {
      providerId: providerIdentifier,
      psuId: req.session.user.identificationNumber.toString(),
      redirectUrl: 'http://localhost:3000/transfer/callback',
      paymentInformation: {
        amount,
        creditorAccountNumber: process.env.OF_CREDITOR_ACCOUNT_NUMBER!,
        creditorAccountType: 'bban',
        creditorName: process.env.OF_CREDITOR_NAME!,
        currency: 'ILS',
        debtorAccountNumber: `${providerId}-${branch}-${bban}`,
        debtorAccountType: 'bban',
        description: 'Deposit',
      },
    },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );

  const { scaOAuth, paymentId } = data;

  const deposit = new Deposit({
    paymentId,
    amount,
    status: 'PENDING',
    userId: req.session.user._id,
  });

  await deposit.save();
  return res.json({ scaOAuth });
});

transferRouter.get('/callback', async (req, res) => {
  const { paymentId, paymentStatus } = req.query;

  if (!paymentId) {
    return res.sendStatus(400);
  }

  const deposit = await Deposit.findOne({ paymentId });
  if (!deposit) {
    return res.sendStatus(404);
  }

  if (paymentStatus === 'RJCT') {
    // deposit.status = 'REJECTED';
    // await deposit.save();
    // return res.redirect('/');
  }

  deposit.status = 'APPROVED';
  await deposit.save();

  const wallet = await Wallet.findOne({ _id: req.session.user?.walletId });
  if (!wallet) {
    return res.sendStatus(404);
  }

  wallet.balance += deposit.amount;
  await wallet.save();

  return res.redirect('/?deposit=success');
});

transferRouter.post('/withdraw', async (req, res) => {
  const { providerIdentifier, providerId, bban, amount, branch } = req.body;

  if (!req.session.user) {
    return res.sendStatus(401);
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }

  const wallet = await Wallet.findOne({ _id: req.session.user.walletId });
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  if (wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  const { data } = await axios.post(
    'https://api.open-finance.ai/v2/pay/open-banking-init',
    {
      providerId: process.env.OF_PROVIDER_ID,
      psuId: process.env.OF_PSU,
      paymentInformation: {
        amount,
        debtorAccountNumber: process.env.OF_CREDITOR_ACCOUNT_NUMBER!,
        debtorAccountType: 'bban',
        currency: 'ILS',
        creditorAccountNumber: `${providerId}-${branch}-${bban}`,
        creditorAccountType: 'bban',
        creditorName: req.session.user.firstName,
        description: 'Withdrawl',
      },
    },
    {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }
  );
  const { scaOAuth } = data;
  const message = `🔔 *New Withdrawal Request*\n👤 *User:* ${req.session.user._id}\n💰 *Amount:* ${amount} ILS\n *Open Finance Payment Link*: ${scaOAuth}`;
  await sendTelegramMessage(message);

  return res.sendStatus(201);
});

export { transferRouter };
