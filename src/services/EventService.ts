import { AppError } from "../error/AppError";
import { Event, EventCreationAttributes } from "../models/Event";
import { EventRepository } from "../repository/EventRepository";
import { GuestService } from "./GuestService";

export class EventService {
    private eventRepository = new EventRepository();
    private guestService = new GuestService();

    async create(data: EventCreationAttributes): Promise<Event> {
        if (!data.location || !data.date || !data.time) {
            throw new Error("Local, data e horário são obrigatórios.");
        }
        return await this.eventRepository.create(data);
    }

    async getAll(): Promise<Event[]> {
        return await this.eventRepository.findAll();
    }

    async getById(id: number): Promise<Event> {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new Error("Evento não encontrado.");
        }
        return event;
    }

    async update(id: number, data: Partial<EventCreationAttributes>): Promise<Event | null> {
        const event = await this.getById(id);
        const updateData: Partial<EventCreationAttributes> = {
            ...(data.location && { location: data.location }),
            ...(data.date && { date: data.date }),
            ...(data.time && { time: data.time })
        };

        return await this.eventRepository.update(id, updateData);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.eventRepository.delete(id);
    }

    async joinEvent(eventId: number, userId: number): Promise<Event> {
        const event = await this.getById(eventId);
        if (event.capacity <= 0) {
            throw new AppError("Event Full.", 400);
        }

        const guest = await this.guestService.getGuest(userId);
        
        await this.eventRepository.decreaseCapacity(eventId);
        
        return await this.getById(eventId);
    }
}