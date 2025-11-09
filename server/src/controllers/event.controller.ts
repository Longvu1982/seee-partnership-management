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

export const createEvent = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = request.user;
    const event = await EventService.createEvent(request.body, user!);
    return sendSuccessResponse(response, event);
  } catch (error: any) {
    next(error);
  }
};

export const getEventByID = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const event = await EventService.getEventByID(id);
    return sendSuccessResponse(response, event);
  } catch (error: any) {
    next(error);
  }
};

export const updateEvent = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const event = await EventService.updateEvent(id, request.body);
    return sendSuccessResponse(response, event);
  } catch (error: any) {
    next(error);
  }
};
