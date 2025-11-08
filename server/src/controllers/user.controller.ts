import { NextFunction, Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const getUserByID = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = request.params.userId;
    const userDetails = await UserService.getUserByID(userId);
    return sendSuccessResponse(response, userDetails);
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
