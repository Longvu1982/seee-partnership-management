import { NextFunction, Request, Response } from 'express';
import * as ContactService from '../services/contact.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const listContacts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const query = request.body;
    const contacts = await ContactService.listContacts(query);
    return sendSuccessResponse(response, contacts);
  } catch (error: any) {
    next(error);
  }
};

export const createContact = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const contact = await ContactService.createContact(request.body);
    return sendSuccessResponse(response, contact);
  } catch (error: any) {
    next(error);
  }
};

export const updateContact = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const contact = await ContactService.updateContact(id, request.body);
    return sendSuccessResponse(response, contact);
  } catch (error: any) {
    next(error);
  }
};
