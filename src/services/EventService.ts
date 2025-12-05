import Event, { EventCreationAttributes } from "../models/Event";
import { EventRepository } from "../repository/EventRepository";

export class EventService {
    private eventRepository = new EventRepository();

    async create(data: EventCreationAttributes): Promise<Event> {
        console.log(data);
        if (!data.local || !data.data || !data.horario) {
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
            ...(data.local && { local: data.local }),
            ...(data.data && { data: data.data }),
            ...(data.horario && { horario: data.horario })
        };

        return await this.eventRepository.update(id, updateData);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.eventRepository.delete(id);
    }
}