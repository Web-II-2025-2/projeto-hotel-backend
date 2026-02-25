import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventAttributes, EventCreationAttributes } from "../models/Event";
import { UserAuthRequest } from "../config/request";


const eventService = new EventService();

export class EventController {

    async createEvent(req: Request<{}, {}, EventCreationAttributes>, res: Response) {
        const event = await eventService.create(req.body);
        return res.status(201).json(event);
    }

    async getEvent(req: Request, res: Response) {
        const event = await eventService.getById(Number(req.params.id));
        return res.json(event);
    }

    async updateEvent(req: Request<{ id: string }, {}, EventAttributes>, res: Response) {
        const event = await eventService.update(Number(req.params.id), req.body);
        return res.json(event);
    }

    async getAllEvents(req: Request, res: Response) {
        const events = await eventService.getAll();
        return res.json(events);
    }

    async deleteEvent(req: Request, res: Response) {
        await eventService.delete(Number(req.params.id));
        return res.status(204).send();
    }

    async joinEvent(req: UserAuthRequest, res: Response) {
        const event =await eventService.joinEvent(Number(req.params.id), Number(req.user.id));
        return res.status(200).json(event);
    }

}