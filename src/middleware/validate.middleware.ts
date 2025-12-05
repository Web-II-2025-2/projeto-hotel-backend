// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from '../error/AppError';

export const validateDTO = (schema: z.ZodSchema<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body); 
    next(); 
    
  } catch (error) {
    if (error instanceof ZodError) {
    
      const message = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
      
      throw new AppError(`Erro de validação: ${message}`, 400); 
    }
    
    next(error); 
  }
};