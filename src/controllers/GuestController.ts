import { Request, Response } from "express";
import { GuestService } from "../services/GuestService";
import { UserAuthRequest } from "../config/request";

const guestService = new GuestService();

export class GuestController {

    async getGuest(req: UserAuthRequest, res: Response) {
        const guest = await guestService.getGuest(req.user.id);
        return res.json(guest);
    }

    async updateGuest(req: UserAuthRequest, res: Response) {
        const guest = await guestService.updateGuest(req.user.id, req.body);
        return res.json(guest);
    }

    async getAllGuests(req: Request, res: Response) {
        const guests = await guestService.getAllGuests();
        return res.json(guests);
    }

    async deleteGuest(req: UserAuthRequest, res: Response) {
        await guestService.deleteGuest(Number(req.user.id));
        return res.status(204).send();
    }
}
