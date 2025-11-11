import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { TloginRead } from '../types/general';
import HttpStatusCode from '../utils/HttpStatusCode';
import { verifyToken } from '../utils/jwtHandler';
import { sendBadRequestResponse, sendForbiddenResponse, sendUnauthorizedResponse } from '../utils/responseHandler';

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
      return sendBadRequestResponse(response, 'Vui lòng đăng nhập');
    }

    if (!user.isActive) {
      response.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });

      return sendUnauthorizedResponse(
        response,
        'Tài khoản đã bị tạm ngưng. Vui lòng liên hệ quản trị viên.',
        HttpStatusCode.NOT_ACCEPTABLE
      );
    }

    if (user.hasPasswordChanged) {
      response.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });

      return sendUnauthorizedResponse(
        response,
        'Mật khẩu đã hết hạn. Vui lòng đăng nhập lại.',
        HttpStatusCode.NOT_ACCEPTABLE
      );
    }

    request.user = { ...user };
    next();
  } catch (error: any) {
    next(error);
  }
};

const protectRoles = (roles: Role[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    if (roles.length > 0 && !roles.includes(user?.role as Role)) {
      return sendForbiddenResponse(response, 'Không có quyền thực hiện tác vụ');
    }
    next();
  };
};
export { protectAuth, protectRoles };
