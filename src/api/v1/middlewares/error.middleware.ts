import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/http.exception.js';
import { logger } from '../../../config/logger.js';
import { ERROR_CODE_000, STATUS_ERROR } from '../../../config/constants.js';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const statusNo: number = error.statusNo || 500;
    const status: string = error.status || STATUS_ERROR;
    const message: string = error.message || 'Something went wrong';
    const errorCode: string = error.errorCode || ERROR_CODE_000;
    const errors = error.errors || [];

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    if (errors.length > 0) {
      res.status(statusNo).json({ status: STATUS_ERROR, errorCode, message, errors });
    }
    else {
      res.status(statusNo).json({ status: STATUS_ERROR, errorCode, message });
    }
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
