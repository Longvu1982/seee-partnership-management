import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { TloginRead } from '../types/general';
import { verifyToken } from '../utils/jwtHandler';
import { sendBadRequestResponse, sendForbiddenResponse } from '../utils/responseHandler';

const protectAuth = async (request: Request, response: Response, next: NextFunction) => {
  const allCookies = request.cookies;
  const token = allCookies.jwt;

  if (!token) {
    return sendBadRequestResponse(response, 'Vui lòng đăng nhập');
  }

  try {
    const decoded = verifyToken(token);
    const user: TloginRead | null = await UserService.getUserByID(decoded.id);

    if (!user) {
      next();
      return sendBadRequestResponse(response, 'Vui lòng đăng nhập');
    }

    request.user = {
      ...user,
    };
    next();
  } catch (error: any) {
    next(error);
  }
};

const protectRoles = (roles: Role[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    if (roles.length > 0 && !roles.includes(user?.account?.role)) {
      return sendForbiddenResponse(response, 'Không có quyền thực hiện tác vụ');
    }
    next();
  };
};
export { protectAuth, protectRoles };
