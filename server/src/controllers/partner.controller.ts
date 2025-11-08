import { NextFunction, Request, Response } from 'express';
import * as PartnerService from '../services/partner.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const listPartners = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const query = request.body;
    const partners = await PartnerService.listPartners(query);
    return sendSuccessResponse(response, partners);
  } catch (error: any) {
    next(error);
  }
};
