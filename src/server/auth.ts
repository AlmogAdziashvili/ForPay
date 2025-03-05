import { Router } from 'express';
import Wallet from './models/wallet.js';
import User from './models/user.js';
import { logger } from './logger.js';
import { compare } from 'bcrypt';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const { identificationNumber, password, birthDate, firstName, lastName } = req.body;
  if (!identificationNumber || !password || !birthDate || !firstName || !lastName) {
    logger.error('/register', 'Missing fields', { body: req.body });
    return res.sendStatus(400);
  }

  if (await User.exists({ identificationNumber })) {
    logger.error('/register', 'User already exists', { identificationNumber });
    return res.sendStatus(409);
  }

  const wallet = new Wallet({
    balance: 0,
  });

  const walletResult = await wallet.save();
  if (!walletResult || walletResult.errors) {
    logger.error('/register', 'Failed to save wallet', { walletResult });
    return res.sendStatus(500);
  }

  const user = new User({
    identificationNumber,
    password,
    birthDate,
    firstName,
    lastName,
    walletId: wallet._id,
  });

  const userResult = await user.save();
  if (!userResult || userResult.errors) {
    logger.error('/register', 'Failed to save user', { userResult });
    return res.sendStatus(500);
  }

  return res.sendStatus(201);
});

authRouter.post('/login', async (req, res, next) => {
  const { identificationNumber, password } = req.body;
  if (!identificationNumber || !password) {
    logger.error('/login', 'Missing fields', { body: req.body });
    return res.sendStatus(400);
  }

  const user = await User.findOne({
    identificationNumber,
  });

  if (!user) {
    logger.error('/login', 'User not found', { identificationNumber });
    return res.sendStatus(404);
  }

  if (!(await compare(password, user.password))) {
    logger.error('/login', 'Invalid password', { identificationNumber });
    return res.sendStatus(401);
  }

  req.session.regenerate(() => {
    req.session.user = user;
    return res.sendStatus(200);
  });
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

authRouter.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  const { firstName, lastName, identificationNumber, birthDate, walletId } = req.session.user;
  const publicUser = { firstName, lastName, identificationNumber, birthDate, walletId };

  const wallet = await Wallet.findById(walletId);
  if (!wallet) {
    logger.error('/me', 'Wallet not found', { walletId });
    return res.sendStatus(500);
  }

  const parentWallet = { balance: wallet.balance };

  const childrenWallets = await Wallet.find({ parentWalletId: walletId });

  return res.json({ user: publicUser, parentWallet, childrenWallets: childrenWallets.map((child) => ({ balance: child.balance, name: child.name })) });
});

export { authRouter };