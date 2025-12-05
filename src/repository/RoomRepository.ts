import { Room, RoomAttributes, RoomCreationAttributes } from "../models/Room";

export class RoomRepository {

  async createRoom(data: RoomCreationAttributes): Promise<Room> {
    const room = await Room.create(data);
    return room;
  }

  async getRoom(id: number): Promise<Room | null> {
    return await Room.findByPk(id);
  }

  async updateRoom(id: number, data: RoomAttributes): Promise<Room | null> {
    const room = await Room.findByPk(id);
    if (!room) return null; 
    await room.update(data);
    return room;
  }

  async getAllRooms(): Promise<Room[]> {
    return await Room.findAll();
  }

  async deleteRoom(id: number) {
    return await Room.destroy({where: { id }});
  }
}
