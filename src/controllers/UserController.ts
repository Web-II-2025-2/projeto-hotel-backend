import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {


    async createUser(req: Request, res: Response) {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }

    async getUser(req: Request, res: Response) {
        const user = await userService.getUser(Number(req.params.id));
        return res.json(user);
    }

    async updateUser(req: Request, res: Response) {
        const user = await userService.updateUser(Number(req.params.id), req.body);
        return res.json(user);
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await userService.getAllUsers();
        return res.json(users);
    }

    async deleteUser(req: Request, res: Response) {
        await userService.deleteUser(Number(req.params.id));
        return res.status(204).send();
    }
}
