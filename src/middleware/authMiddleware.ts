import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AppError } from '../error/AppError';
import { RoleType } from '../enums/RoleType';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new AppError('Access denied. No token provided.', 401);
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded; // Adiciona o usuário decodificado ao objeto `req`
    next();
  } catch (err) {
    throw new AppError('Invalid or expired token.', 401);
  }
};

export const authorize = (allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new AppError('Access denied. You do not have permission to perform this action.', 403);
    }

    next();
  };
};