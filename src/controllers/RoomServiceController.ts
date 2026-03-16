import { Request, Response } from "express";
import { RoomServiceService } from "../services/RoomServiceRequest";

const roomServiceService = new RoomServiceService();

export class RoomServiceController {

  async requestService(req: Request, res: Response) {
    const reservationId = Number(req.params.id);
    const guestId = (req as any).user.id;
    const { message, requestCleaning } = req.body;
    const result = await roomServiceService.requestService(reservationId, guestId, message, requestCleaning ?? false);
    return res.status(201).json(result);
  }

  async getByReservation(req: Request, res: Response) {
    const reservationId = Number(req.params.id);
    const requests = await roomServiceService.getByReservation(reservationId);
    return res.json(requests);
  }

  // Para uso futuro do painel do employee
  async getAll(req: Request, res: Response) {
    const requests = await roomServiceService.getAll();
    return res.json(requests);
  }
}