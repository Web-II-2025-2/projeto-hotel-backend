import Event, { EventCreationAttributes, EventAttributes } from "../models/Event";

export class EventRepository {
    
    async create(data: EventCreationAttributes): Promise<Event> {
        return await Event.create(data);
    }

    async findAll(): Promise<Event[]> {
        return await Event.findAll();
    }

    async findById(id: number): Promise<Event | null> {
        return await Event.findByPk(id);
    }

    async update(id: number, data: Partial<EventAttributes>): Promise<Event | null> {
        const event = await Event.findByPk(id);
        if (!event) return null;
        return await event.update(data);
    }

    async delete(id: number): Promise<void> {
        await Event.destroy({ where: { id } });
    }
}