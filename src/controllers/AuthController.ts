import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {

  register = async (req: Request, res: Response) => {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  }
}
