import {
  RoomServiceRequest,
  RoomServiceRequestCreationAttributes,
} from "../models/RoomServiceRequest";

export class RoomServiceRepository {
  async create(data: RoomServiceRequestCreationAttributes): Promise<RoomServiceRequest> {
    return await RoomServiceRequest.create(data);
  }

  async getByReservationId(reservationId: number): Promise<RoomServiceRequest[]> {
    return await RoomServiceRequest.findAll({
      where: { reservationId },
      order: [["createdAt", "DESC"]],
    });
  }

  async getAll(): Promise<RoomServiceRequest[]> {
    return await RoomServiceRequest.findAll({
      order: [["createdAt", "DESC"]],
    });
  }
}