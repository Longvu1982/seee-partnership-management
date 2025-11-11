import { Prisma, Role, User } from '@prisma/client';
import { QueryDataModel, TloginRead, TUserCreate, TUserUpdate } from '../types/general';
import { db } from '../utils/db.server';
import bcrypt from 'bcryptjs';
import { hashPassword } from '../utils/bcryptHandler';

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

export const createUser = async (data: TUserCreate): Promise<TloginRead> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await db.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const updateUser = async (
  id: string,
  data: TUserUpdate,
  requestUser: TloginRead
): Promise<{ user: TloginRead; hasPasswordChanged: boolean }> => {
  const updateData = { ...data };

  const newPassword = data.password?.trim();
  const currentPassword = data.currentPassword?.trim();

  // Only check these logic if
  // 1. User is not admin
  // 2. User is admin and is updating own account

  if (requestUser.role !== Role.ADMIN || (requestUser.role === Role.ADMIN && requestUser.id === id)) {
    if (newPassword && !currentPassword) {
      throw new Error('Mật khẩu hiện tại không được để trống.');
    }

    if (currentPassword) {
      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error('Người dùng không tồn tại.');
      }

      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordCorrect) {
        throw new Error('Mật khẩu hiện tại không đúng.');
      }
    }
  }

  let hasPasswordChanged = false;

  if (newPassword) {
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự.');
    } else {
      updateData.password = await hashPassword(newPassword);
      updateData.hasPasswordChanged = true;
      hasPasswordChanged = true;
    }
  }

  delete updateData.currentPassword;

  const user = await db.user.update({
    where: { id },
    data: updateData,
    omit: {
      password: true,
    },
  });

  return { user, hasPasswordChanged };
};

export const updateUserStatus = async (id: string, isActive: boolean): Promise<TloginRead> => {
  const user = await db.user.update({
    where: { id },
    data: { isActive },
    omit: {
      password: true,
    },
  });

  return user;
};

export const updateUserPasswordChangedStatus = async (id: string, hasPasswordChanged: boolean): Promise<User> => {
  const user = await db.user.update({
    where: { id },
    data: { hasPasswordChanged },
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

  // Sort users so the current logged-in user is always on top
  const sortedUsers = users.sort((a, b) => {
    if (a.id === requestUser.id) return -1;
    if (b.id === requestUser.id) return 1;
    return 0;
  });

  return { totalCount, users: sortedUsers };
};
