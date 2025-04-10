import express, { RequestHandler } from 'express';
import ViteExpress from 'vite-express';
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import { logger } from './logger.js';
import { authRouter } from './auth.js';
import session from 'express-session';
import { paymentsRouter } from './payments.js';

dotenv.config();

async function mongoDBConnect() {
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster2.beaukxi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2`;
  const clientOptions: ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db?.admin().command({ ping: 1 });
  logger.info('Connected to MongoDB');
}

const app = express();
mongoDBConnect().catch(console.dir);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET!,
}));

const restrict: RequestHandler<{}, any, any, any, Record<string, any>> = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  return next();
};

app.use('/auth', authRouter);
app.use('/payments', restrict, paymentsRouter);
app.get('/', restrict)

ViteExpress.listen(app, 3000, () =>
  logger.info('Server listening on http://localhost:3000')
);
