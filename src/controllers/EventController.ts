import { Request, Response } from "express";
import { EventService } from "../services/EventService";
import { EventAttributes, EventCreationAttributes } from "../models/Event";

const eventService = new EventService();

export class EventController {

    async createEvent(req: Request<{}, {}, EventCreationAttributes>, res: Response) {
        try {
            const event = await eventService.create(req.body);
            return res.status(201).json(event);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async getEvent(req: Request, res: Response) {
        try {
            const event = await eventService.getById(Number(req.params.id));
            return res.json(event);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async updateEvent(req: Request<{ id: string }, {}, EventAttributes>, res: Response) {
        try {
            const event = await eventService.update(Number(req.params.id), req.body);
            return res.json(event);
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }

    async getAllEvents(req: Request, res: Response) {
        try {
            const event = await eventService.getAll();
            return res.json(event);
        } catch (e: any) {
            return res.status(400).json({ error: e.message });
        }
    }

    async deleteEvent(req: Request, res: Response) {
        try {
            await eventService.delete(Number(req.params.id));
            return res.status(204).send();
        } catch (e: any) {
            return res.status(404).json({ error: e.message });
        }
    }
}
