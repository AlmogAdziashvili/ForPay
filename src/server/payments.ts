import { Router } from 'express';
import openFinance from '@api/open-finance-auth';
import openFinanceData from '@api/open-finance-data';
import { logger } from './logger.js';
import axios from 'axios';
import Deposit from './models/deposit.js';
import Wallet from './models/wallet.js';
import { sendTelegramMessage } from './telegram.js';
import user from './models/user.js';
import Transfer from './models/transfer.js';
import Withdraw from './models/withdraw.js';

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

const paymentsRouter = Router();

paymentsRouter.get('/providers', async (req, res) => {
  const sdk = openFinanceData.default.auth(await getToken());
  const providersResponse = await sdk.getProviders();
  return res.json(
    providersResponse.data
      .filter((provider) => !!provider.bankCode)
      .sort((a, b) => (a.sortIndex || 99) - (b.sortIndex || 99))
  );
});

paymentsRouter.post('/deposit', async (req, res) => {
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

paymentsRouter.get('/actions', async (req, res) => {
  const deposits = (await Deposit.find({ userId: req.session.user?._id, status: 'APPROVED' })).map(d => ({ ...d.toObject(), type: 'DEPOSIT' }));
  const transfersFromMe = (await Transfer.find({ senderId: req.session.user?._id }).populate('recipientId')).map(t => {
    return { ...t.toObject(), type: 'TRANSFER_FROM_ME', amount: -1 * t.amount };
  });
  const transfersToMe = (await Transfer.find({ recipientId: req.session.user?._id }).populate('senderId')).map(t => {
    return { ...t.toObject(), type: 'TRANSFER_TO_ME' };
  });
  const withdraws = (await Withdraw.find({ userId: req.session.user?._id })).map(w => ({ ...w.toObject(), type: 'WITHDRAW', amount: -1 * w.amount }));
  const actions = [...deposits, ...transfersFromMe, ...transfersToMe, ...withdraws].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(actions);
});

paymentsRouter.get('/callback', async (req, res) => {
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

paymentsRouter.post('/withdraw', async (req, res) => {
  const { providerId, bban, amount, branch } = req.body;

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
  const message = `🔔 *New Withdrawal Request*\n👤 *User:* ${req.session.user.identificationNumber}\n💰 *Amount:* ${amount} ILS\n *Open Finance Payment Link*: ${scaOAuth}`;
  await sendTelegramMessage(message);

  wallet.balance -= amount;
  await wallet.save();

  const withdraw = new Withdraw({
    paymentId: data.paymentId,
    amount,
    userId: req.session.user._id,
  });

  await withdraw.save();

  return res.sendStatus(201);
});

paymentsRouter.post('/transfer', async (req, res) => {
  const { amount, identificationNumber } = req.body;
  if (!req.session.user?.walletId || !amount || amount <= 0 || !identificationNumber || !(/^\d{9}$/).test(identificationNumber)) {
    return res.sendStatus(400);
  }

  const wallet = await Wallet.findOne({ _id: req.session.user.walletId });
  const recipient = await user.findOne({ identificationNumber });
  const recipientWallet = await Wallet.findOne({ _id: recipient?.walletId });

  if (!wallet || !recipient || !recipientWallet) {
    return res.sendStatus(404);
  }

  if (amount > wallet.balance) {
    return res.sendStatus(403);
  }

  const transfer = new Transfer({
    amount,
    senderId: req.session.user._id,
    recipientId: recipient._id
  });

  wallet.balance -= amount;
  recipientWallet.balance += amount;

  await wallet.save();
  await recipientWallet.save();
  await transfer.save();

  return res.sendStatus(200);
});

export { paymentsRouter };
