import * as UserService from '../services/user.service';
import { NextFunction, Request, Response } from 'express';
import { sendSuccessNoDataResponse, sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';
import { comparePasswords } from '../utils/bcryptHandler';
import { generateToken } from '../utils/jwtHandler';
import { loginSchema } from '../types/zod';

export const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userRequest = request.body;
    const user = await UserService.getAccountByUsername(userRequest.username);

    if (!user) {
      return sendUnauthorizedResponse(response, 'Username không tồn tại.');
    }

    if (!user.isActive) {
      return sendUnauthorizedResponse(response, 'Tài khoản đã bị tạm ngưng. Vui lòng liên hệ quản trị viên.');
    }

    const passwordCompare = await comparePasswords(userRequest.password, user.password);

    if (passwordCompare) {
      // Reset hasPasswordChanged to false on successful login
      const updatedUser = await UserService.updateUserPasswordChangedStatus(user.id, false);

      const token = generateToken({ id: user.id }, '30d');

      response.cookie('jwt', token, {
        httpOnly: true,
        // secure: process.env.APP_ENV !== 'developement',
        secure: false,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      const { password, ...rest } = updatedUser;
      return sendSuccessResponse(response, rest);
    } else {
      return sendUnauthorizedResponse(response, 'Sai username hoặc mật khẩu.');
    }
  } catch (error: any) {
    next(error);
  }
};

export const authMe = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;

    return sendSuccessResponse(response, user);
  } catch (error: any) {
    next(error);
  }
};

export const logout = async (_request: Request, response: Response, next: NextFunction) => {
  try {
    response.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return sendSuccessNoDataResponse(response, 'Logout Successful');
  } catch (error) {
    next(error);
  }
};

// Middlewares ________________________
export const validateLoginData = (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    loginSchema.parse(data);
    next();
  } catch (error) {
    next(error);
  }
};
