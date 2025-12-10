import { Request, Response } from "express";
import { ReservationCreationAttributes, ReservationAttributes } from "../models/Reservation";
import { ReservationService } from "../services/ReservationService";

const reservationService = new ReservationService();

export class ReservationController {

    async createReservation(req: Request<{}, {}, ReservationCreationAttributes>, res: Response) {
        const reservation = await reservationService.create(req.body);
        return res.status(201).json(reservation);
    }

    async getReservation(req: Request, res: Response) {
        const reservation = await reservationService.getById(Number(req.params.id));
        return res.json(reservation);
    }

    async updateReservation(req: Request<{ id: string }, {}, ReservationAttributes>, res: Response) {
        const reservation = await reservationService.update(Number(req.params.id), req.body);
        return res.json(reservation);
    }

    async getAllReservations(req: Request, res: Response) {
        const reservation = await reservationService.getAll();
        return res.json(reservation);
    }

    async deleteReservation(req: Request, res: Response) {
        await reservationService.delete(Number(req.params.id));
        return res.status(204).send();
    }
}
