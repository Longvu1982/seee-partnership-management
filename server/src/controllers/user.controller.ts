import { NextFunction, Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { sendSuccessResponse, sendUnauthorizedResponse } from '../utils/responseHandler';
import { Role } from '@prisma/client';

export const getUserByID = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.params.userId;
    const userDetails = await UserService.getUserByID(userId);
    return sendSuccessResponse(response, userDetails);
  } catch (error: any) {
    next(error);
  }
};

export const createUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    const user = await UserService.createUser(data);
    return sendSuccessResponse(response, user);
  } catch (error: any) {
    next(error);
  }
};

export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const data = request.body;
    const requestUser = request.user;

    const isUpdatingOwnAccount = requestUser?.id === id;

    // Cannot change password of other users if not admin
    if (!isUpdatingOwnAccount && !(requestUser?.role === Role.ADMIN)) {
      return sendUnauthorizedResponse(response, 'Không có quyền thực hiện');
    }

    const { user, hasPasswordChanged } = await UserService.updateUser(id, data, requestUser!);

    // If changing own password, logout the user
    if (isUpdatingOwnAccount && hasPasswordChanged) {
      response.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });
    }

    return sendSuccessResponse(response, { user });
  } catch (error: any) {
    if (error.message) return sendUnauthorizedResponse(response, error.message);
    next(error);
  }
};

export const updateUserStatus = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const { isActive } = request.body;
    const user = await UserService.updateUserStatus(id, isActive);
    return sendSuccessResponse(response, user);
  } catch (error: any) {
    next(error);
  }
};

export const listUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;
    const query = request.body;
    const orders = await UserService.listUsers(query, user!);
    return sendSuccessResponse(response, orders);
  } catch (error: any) {
    next(error);
  }
};
