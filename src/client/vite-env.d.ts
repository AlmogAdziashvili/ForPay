/// <reference types="vite/client" />

import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      identificationNumber: number;
      birthDate: NativeDate;
      walletId: Types.ObjectId;
      password: string;
    };
  }
}