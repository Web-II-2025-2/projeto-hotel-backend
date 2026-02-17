import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RoleType } from "../enums/RoleType";

const authService = new AuthService();

export class AuthController {
  register_guest = async (req: Request, res: Response) => {
    const result = await authService.registerGuest(req.body);
    return res.status(201).json(result);
  };

  register_manager = async (req: Request, res: Response) => {
    const result = await authService.registerEmployee(
      req.body,
      RoleType.MANAGER,
    );
    return res.status(201).json(result);
  };

  register_employee = async (req: Request, res: Response) => {
    const result = await authService.registerEmployee(
      req.body,
      RoleType.EMPLOYEE,
    );
    return res.status(201).json(result);
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  };

  updateRole = async (req: Request, res: Response) => {
    const { role, email } = req.body;
    const requester = (req as any).user;

    const result = await authService.updateRole(
      email,
      role,
      requester.id,
      requester.role,
    );

    return res.status(200).json(result);
  };
}
