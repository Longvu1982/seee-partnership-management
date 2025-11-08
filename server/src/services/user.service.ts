import { User } from '@prisma/client';
import { TloginRead } from '../types/general';
import { db } from '../utils/db.server';

export const getUserByID = async (id: string): Promise<TloginRead | null> => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const getAccountByUsername = async (username: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
};
