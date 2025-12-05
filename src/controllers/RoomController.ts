import { Request, Response } from "express";
import { RoomService } from "../services/RoomService";
import { RoomCreationAttributes, RoomAttributes } from "../models/Room";

const roomService = new RoomService();

export class RoomController {

    async createRoom(req: Request<{}, {}, RoomCreationAttributes>, res: Response) {
        const room = await roomService.createRoom(req.body);
        return res.status(201).json(room);
    }

    async getRoom(req: Request, res: Response) {
        const room = await roomService.getRoom(Number(req.params.id));
        return res.json(room);
    }

    async updateRoom(req: Request<{ id: string }, {}, RoomAttributes>, res: Response) {
        const room = await roomService.updateRoom(Number(req.params.id), req.body);
        return res.json(room);
    }

    async getAllRooms(req: Request, res: Response) {
        const rooms = await roomService.getAllRooms();
        return res.json(rooms);

    }

    async deleteRoom(req: Request, res: Response) {
        await roomService.deleteRoom(Number(req.params.id));
        return res.status(204).send();
    }
}
