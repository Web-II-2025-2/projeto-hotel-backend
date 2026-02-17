import { Request, Response, NextFunction } from "express";
import { AppError } from "../error/AppError";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
      stack: err.stack 
    });
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};