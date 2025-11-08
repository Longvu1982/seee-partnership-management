import { User } from '@prisma/client';

// _____________  User Types  _____________
export type TUserRegisterWrite = Omit<User, 'createdAt' | 'updatedAt'>;
export type TloginRead = Omit<User, 'password'>;
export type TloginRequest = Pick<User, 'username' | 'password'>;
