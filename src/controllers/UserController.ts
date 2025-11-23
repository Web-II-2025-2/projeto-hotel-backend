import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {

    //TODO: implement other exceptions.

    async createUser(req: Request, res: Response) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json(user);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const user = await userService.getUser(Number(req.params.id));
            return res.json(user);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const user = await userService.updateUser(Number(req.params.id), req.body);
            return res.json(user);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            await userService.deleteUser(Number(req.params.id));
            return res.status(204).send();
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }
}
