import Room, { RoomAttributes, RoomCreationAttributes } from "../models/Room";
import { RoomRepository } from "../repository/RoomRepository";

export class RoomService {
  private roomRepository = new RoomRepository();

  async createRoom (data: RoomCreationAttributes): Promise<Room> {
    return await this.roomRepository.createRoom(data);
  }

  async getRoom(id: number): Promise<Room | null>  {
    const room = await this.roomRepository.getRoom(id);
    if (!room) throw new Error("Room not found");
    return room;
  }
  
  async updateRoom(id: number, data: RoomAttributes): Promise<Room | null> {
    const room = await this.roomRepository.updateRoom(id, data);
    if (!room) throw new Error("Room not found");
    return room;
  }

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.getAllRooms();
  }

  async deleteRoom(id: number) {
    const deleted = await this.roomRepository.deleteRoom(id);
    if (!deleted) throw new Error("Room not found");
    return true;
  }
}
