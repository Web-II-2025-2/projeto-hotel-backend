import { Request, Response } from "express";
import { ReservationCreationAttributes, ReservationAttributes } from "../models/Reservation";
import { ReservationService } from "../services/ReservationService";

const reservationService = new ReservationService();

export class ReservationController {

    async createReservation(req: Request<{}, {}, ReservationCreationAttributes>, res: Response) {
        try {
            const reservation = await reservationService.create(req.body);
            return res.status(201).json(reservation);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getReservation(req: Request, res: Response) {
        try {
            const reservation = await reservationService.getById(Number(req.params.id));
            return res.json(reservation);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async updateReservation(req: Request<{ id: string }, {}, ReservationAttributes>, res: Response) {
        try {
            const reservation = await reservationService.update(Number(req.params.id), req.body);
            return res.json(reservation);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async getAllReservations(req: Request, res: Response) {
        try {
            const reservation = await reservationService.getAll();
            return res.json(reservation);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteReservation(req: Request, res: Response) {
        try {
            await reservationService.delete(Number(req.params.id));
            return res.status(204).send();
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }
}
