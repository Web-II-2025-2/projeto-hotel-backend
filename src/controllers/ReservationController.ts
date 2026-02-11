import { Request, Response } from "express";
import {
  ReservationCreationAttributes,
  ReservationAttributes,
} from "../models/Reservation";
import { ReservationService } from "../services/ReservationService";
import { UserAuthRequest } from "../config/request";

const reservationService = new ReservationService();

export class ReservationController {
  async createReservation(
    req: Request<{}, {}, Omit<ReservationCreationAttributes, "guestId">>,
    res: Response,
  ) {
    const credentialId = (req as any).user.id;
    const reservation = await reservationService.create(credentialId, req.body);
    return res.status(201).json(reservation);
  }

  async getReservation(req: Request, res: Response) {
    const reservation = await reservationService.getById(Number(req.params.id));
    return res.json(reservation);
  }

  async updateReservation(
    req: Request<{ id: string }, {}, ReservationAttributes>,
    res: Response,
  ) {
    const reservation = await reservationService.update(
      Number(req.params.id),
      req.body,
    );
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

  async getMyReservations(req: UserAuthRequest, res: Response) {
    const reservations = await reservationService.getByGuestId(req.user.id);
    return res.json(reservations);
  }

  async checkout(req: Request, res: Response) {
    const reservationId = req.params.id;
    const credentialId = (req as any).user.id;

    const result = await reservationService.markAsCheckedOut(
      Number(reservationId),
      credentialId,
    );

    return res.json(result);
  }
}
