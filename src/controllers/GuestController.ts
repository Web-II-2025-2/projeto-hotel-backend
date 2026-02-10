import { Request, Response } from "express";
import { GuestService } from "../services/GuestService";
    
const guestService = new GuestService();

export class GuestController {


    async createGuest(req: Request, res: Response) {
        const guest = await guestService.createGuest(req.body);
        return res.status(201).json(guest);
    }

    async getGuest(req: Request, res: Response) {
        const guest = await guestService.getGuest(Number(req.params.id));
        return res.json(guest);
    }

    async updateGuest(req: Request, res: Response) {
        const guest = await guestService.updateGuest(Number(req.params.id), req.body);
        return res.json(guest);
    }

    async getAllGuests(req: Request, res: Response) {
        const guests = await guestService.getAllGuests();
        return res.json(guests);
    }

    async deleteGuest(req: Request, res: Response) {
        await guestService.deleteGuest(Number(req.params.id));
        return res.status(204).send();
    }
}
