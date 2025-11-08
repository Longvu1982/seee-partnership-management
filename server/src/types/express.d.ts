import { TloginRead, TloginRequest } from './general';

declare type RequestUser = TloginRequest & { account: Omit<Account, 'createdAt' | 'updatedAt' | 'password'> };
declare module 'express' {
  interface Request {
    user?: TloginRead;
  }
}
