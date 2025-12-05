import { Op } from "sequelize";
import { ReservationStatus } from "../enums/ReservationStatus";
import Reservation, { ReservationCreationAttributes, ReservationAttributes } from "../models/Reservation";

export class ReservationRepository {
  
  async create(data: ReservationCreationAttributes): Promise<Reservation> {
    return await Reservation.create(data);
  }

  async findById(id: number): Promise<Reservation | null> {
    return await Reservation.findByPk(id);
  }

  async findAll(): Promise<Reservation[]> {
    return await Reservation.findAll();
  }

  async update(id: number, data: Partial<ReservationAttributes>): Promise<Reservation | null> {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) return null;
    return await reservation.update(data);
  }

  async delete(id: number){
    return await Reservation.destroy({where: { id }});
  }

  async findPossibleReservation(
    roomId: number, 
    checkIn: Date, 
    checkOut: Date, 
    excludeId?: number
  ): Promise<Reservation | null> {
    
    const whereClause: any = {
      roomId: roomId,
      status: { [Op.not]: ReservationStatus.CANCELED }, 
      [Op.and]: [
        { checkIn: { [Op.lt]: checkOut } }, 
        { checkOut: { [Op.gt]: checkIn } }  
      ]
    };

    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    return await Reservation.findOne({ where: whereClause });
  }
}