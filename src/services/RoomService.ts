import { RoomStatus } from "../enums/RoomStatus";
import { RoomType } from "../enums/RoomType";
import { AppError } from "../error/AppError";
import { Room, RoomAttributes, RoomCreationAttributes } from "../models/Room";
import { RoomRepository } from "../repository/RoomRepository";

export class RoomService {
  private roomRepository = new RoomRepository();

  async createRoom(data: RoomCreationAttributes): Promise<Room> {
    const roomAlreadyExists = await this.roomRepository.findByNumber(
      data.number,
    );

    if (roomAlreadyExists) {
      throw new AppError("Este número de quarto já está sendo utilizado.", 409);
    }
    return await this.roomRepository.createRoom(data);
  }

  async getRoom(id: number): Promise<Room> {
    const room = await this.roomRepository.getRoom(id);
    if (!room) throw new AppError("room not found.", 404);
    return room;
  }

  async updateRoom(id: number, data: Partial<RoomAttributes>): Promise<Room | null> {
    const room = await Room.findByPk(id);
    if (!room) return null;
    return await room.update(data); 
  }

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.getAllRooms();
  }

  async deleteRoom(id: number) {
    const deleted = await this.roomRepository.deleteRoom(id);
    if (!deleted) throw new AppError("Room not found", 404);
    return true;
  }

  async cleanRoom(roomId: number) {
    const room = await this.getRoom(roomId);
    if (room.status !== RoomStatus.DIRTY) {
        throw new AppError("Este quarto não está marcado para limpeza.", 400);
    }
    return await this.updateRoom(roomId, { 
        ...room.get(),
        status: RoomStatus.AVAILABLE 
        });
  }
}
