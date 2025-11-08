import { Prisma, User } from '@prisma/client';
import { QueryDataModel, TloginRead } from '../types/general';
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

export const listUsers = async (
  model: QueryDataModel,
  requestUser: TloginRead
): Promise<{ totalCount: number; users: User[] }> => {
  const { pagination, searchText, sort, filter } = model;

  const { pageSize, pageIndex } = pagination;
  const query: Prisma.UserFindManyArgs = {
    where: {},
    orderBy: {},
    include: {},
    omit: {
      password: true,
    },
  };

  if (pageSize) {
    query.skip = pageIndex * pageSize;
    query.take = pageSize;
  }

  if (filter?.length) {
    query.where = {
      ...query.where,
      AND: filter.map(({ column, value }) => ({
        [column]: Array.isArray(value) ? { in: value } : value,
      })),
    };
  }

  if (searchText) {
    query.where = {
      ...query.where,
      OR: [
        { name: { contains: searchText, mode: 'insensitive' } },
        { email: { contains: searchText, mode: 'insensitive' } },
      ],
    };
  }

  if (sort?.column) {
    query.orderBy = {
      [sort.column]: sort.type,
    };
  }

  const [totalCount, users] = await Promise.all([db.user.count({ where: query.where }), db.user.findMany(query)]);

  return { totalCount, users };
};
