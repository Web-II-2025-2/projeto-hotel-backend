import { Request, Response } from "express";
import { RoomService } from "../services/RoomService";
import { RoomCreationAttributes, RoomAttributes } from "../models/Room";

const roomService = new RoomService();

export class RoomController {

    async createRoom(req: Request<{}, {}, RoomCreationAttributes>, res: Response) {
        try {
            const room = await roomService.createRoom(req.body);
            return res.status(201).json(room);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getRoom(req: Request, res: Response) {
        try {
            const room = await roomService.getRoom(Number(req.params.id));
            return res.json(room);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async updateRoom(req: Request<{ id: string }, {}, RoomAttributes>, res: Response) {
        try {
            const room = await roomService.updateRoom(Number(req.params.id), req.body);
            return res.json(room);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async getAllRooms(req: Request, res: Response) {
        try {
            const rooms = await roomService.getAllRooms();
            return res.json(rooms);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteRoom(req: Request, res: Response) {
        try {
            await roomService.deleteRoom(Number(req.params.id));
            return res.status(204).send();
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }
}
