import { NextFunction, Request, Response } from 'express';
import * as EventService from '../services/event.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const listEvents = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;
    const query = request.body;
    const events = await EventService.listEvents(query, user!);
    return sendSuccessResponse(response, events);
  } catch (error: any) {
    next(error);
  }
};
