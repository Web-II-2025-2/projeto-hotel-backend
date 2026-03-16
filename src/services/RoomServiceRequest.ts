import { RoomServiceRepository } from "../repository/RoomServiceRepository";
import { ReservationService } from "./ReservationService";
import { RoomService } from "./RoomService";
import { AppError } from "../error/AppError";
import { ReservationStatus } from "../enums/ReservationStatus";
import { RoomStatus } from "../enums/RoomStatus";
import { GuestService } from "./GuestService";

const roomServiceRepository = new RoomServiceRepository();
const reservationService = new ReservationService();
const roomService = new RoomService();
const guestService = new GuestService();

export class RoomServiceService {

  async requestService(
    reservationId: number,
    credentialId: number, 
    message: string,
    requestCleaning: boolean = false,
  ) {
    const reservation = await reservationService.getById(reservationId);
    if (!reservation) throw new AppError("Reserva não encontrada.", 404);
    if (reservation.status !== ReservationStatus.CHECKED_IN)
      throw new AppError(
        "Serviço só disponível para hóspedes hospedados.",
        400,
      );
    if (!message || message.trim().length === 0)
      throw new AppError("A mensagem não pode estar vazia.", 400);

    const guest = await guestService.getGuest(credentialId);
    if (!guest) throw new AppError("Hóspede não encontrado.", 404);

    if (requestCleaning) {
        const room = await roomService.getRoom(reservation.roomId);
        await roomService.updateRoom(room.id, { status: RoomStatus.DIRTY });
    }

    return await roomServiceRepository.create({
      reservationId,
      roomId: reservation.roomId,
      guestId: guest.id, 
      message: message.trim(),
      requestCleaning,
    });
  }

  async getByReservation(reservationId: number) {
    return await roomServiceRepository.getByReservationId(reservationId);
  }

  async getAll() {
    return await roomServiceRepository.getAll();
  }
}
