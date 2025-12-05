import { AppError } from "../error/AppError";
import Room, { RoomAttributes, RoomCreationAttributes } from "../models/Room";
import { RoomRepository } from "../repository/RoomRepository";

export class RoomService {
  private roomRepository = new RoomRepository();

  async createRoom (data: RoomCreationAttributes): Promise<Room> {
    const roomAlreadyExists = await this.roomRepository.findByNumber(data.number);

    if (roomAlreadyExists) {
      throw new AppError('Este número de quarto já está sendo utilizado.', 409);
    }
    return await this.roomRepository.createRoom(data);
  }

  async getRoom(id: number): Promise<Room | null>  {
    const room = await this.roomRepository.getRoom(id);
    if (!room) throw new AppError('room not found.', 404);
    return room;
  }
  
  async updateRoom(id: number, data: RoomAttributes): Promise<Room | null> {
    const roomAlreadyExists = await this.roomRepository.findByNumber(data.number);

    if (roomAlreadyExists && roomAlreadyExists.id !== id) {
      throw new AppError('Este número de quarto já está sendo utilizado.', 409);
    }

    const room = await this.roomRepository.updateRoom(id, data);
    if (!room) throw new AppError("Room not found", 404);
    return room;
  }

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.getAllRooms();
  }

  async deleteRoom(id: number) {
    const deleted = await this.roomRepository.deleteRoom(id);
    if (!deleted) throw new AppError("Room not found", 404);
    return true;
  }
}
