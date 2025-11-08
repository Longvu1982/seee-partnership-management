import { Request, Response } from 'express';
import { sendNotFoundResponse } from '../utils/responseHandler';

export const notFoundHandler = (request: Request, response: Response) => {
  const notFoundMessage = {
    Requested_URL: request.originalUrl,
    success: false,
    error: 'Route không tồn tại',
  };
  return sendNotFoundResponse(response, notFoundMessage);
};
