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
