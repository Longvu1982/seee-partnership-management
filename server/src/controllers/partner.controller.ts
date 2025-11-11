import { NextFunction, Request, Response } from 'express';
import * as PartnerService from '../services/partner.service';
import { sendSuccessResponse } from '../utils/responseHandler';

export const createPartner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const data = request.body;
    const partner = await PartnerService.createPartner(data);
    return sendSuccessResponse(response, partner);
  } catch (error: any) {
    next(error);
  }
};

export const updatePartner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const data = request.body;
    const partner = await PartnerService.updatePartner(id, data);
    return sendSuccessResponse(response, partner);
  } catch (error: any) {
    next(error);
  }
};

export const updatePartnerStatus = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const { isActive } = request.body;
    const partner = await PartnerService.updatePartnerStatus(id, isActive);
    return sendSuccessResponse(response, partner);
  } catch (error: any) {
    next(error);
  }
};

export const deletePartner = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params;
    const partner = await PartnerService.deletePartner(id);
    return sendSuccessResponse(response, partner);
  } catch (error: any) {
    next(error);
  }
};

export const listPartners = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const query = request.body;
    const partners = await PartnerService.listPartners(query);
    return sendSuccessResponse(response, partners);
  } catch (error: any) {
    next(error);
  }
};
