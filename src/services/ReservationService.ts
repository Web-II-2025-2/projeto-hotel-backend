import { RoomService } from "./RoomService";
import { UserService } from "./UserService";
import Reservation, { ReservationCreationAttributes } from "../models/Reservation";
import { ReservationRepository } from "../repository/ReservationRepository";
import { ReservationStatus } from "../enums/ReservationStatus";
import { AppError } from "../error/AppError";

export class ReservationService {

    private roomService = new RoomService();

    private userService = new UserService();

    private reservationRepository = new ReservationRepository();
    async create(data: ReservationCreationAttributes): Promise<Reservation> {
        const { userId, roomId, checkIn, checkOut } = data;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        const room = await this.roomService.getRoom(roomId);
        const user = await this.userService.getUser(userId);

        const isOccupied = await this.checkIfAlreadyHasReservation(roomId, checkInDate, checkOutDate);
        if (isOccupied) {
            throw new AppError("O quarto já está ocupado nos dias escolhidos.", 409);
        }

        const totalPrice = this.calculateTotalPrice(checkInDate, checkOutDate, room.dailyRate);

        return await this.reservationRepository.create({
            userId,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice,
            status: ReservationStatus.CONFIRMED
        });
    }

    async getAll(): Promise<Reservation[]> {
        return await this.reservationRepository.findAll();
    }

    async getById(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) {
            throw new AppError("Reserva não encontrada.", 404);
        }
        return reservation;
    }

    async update(id: number, data: Partial<ReservationCreationAttributes>): Promise<Reservation | null> {
        const reservation = await this.getById(id);

        if (reservation.status === ReservationStatus.CANCELED || reservation.status === ReservationStatus.CHECKED_OUT) 
          throw new AppError("Não é possível alterar uma reserva cancelada ou finalizada.", 400);

        const newCheckIn = data.checkIn ? new Date(data.checkIn) : reservation.checkIn;
        const newCheckOut = data.checkOut ? new Date(data.checkOut) : reservation.checkOut;
        
        const hasDateChanged = newCheckIn.getTime() !== reservation.checkIn.getTime() || 
                               newCheckOut.getTime() !== reservation.checkOut.getTime();

        if (hasDateChanged) {
            if (newCheckIn >= newCheckOut) {
                throw new AppError("A data de check-out deve ser posterior ao check-in.", 400);
            }

            const isOccupied = await this.checkIfAlreadyHasReservation(reservation.roomId, newCheckIn, newCheckOut, id);
            
            if (isOccupied) throw new AppError("As novas datas não estão disponíveis para este quarto.", 409);

            const room = await this.roomService.getRoom(reservation.roomId);

            reservation.totalPrice = this.calculateTotalPrice(newCheckIn, newCheckOut, room.dailyRate);
        }

        if (data.userId) reservation.userId = data.userId;
        
        reservation.checkIn = newCheckIn;
        reservation.checkOut = newCheckOut;
        
        return await this.reservationRepository.update(id, reservation.get());
    }

    async delete(id: number): Promise<void> {
        const reservation = await this.getById(id);
        reservation.status = ReservationStatus.CANCELED;
        await this.reservationRepository.delete(id);
    }

    private calculateTotalPrice(checkIn: Date, checkOut: Date, dailyRate: number): number {
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysToCharge = diffDays === 0 ? 1 : diffDays;
        return daysToCharge * dailyRate;
    }

    private async checkIfAlreadyHasReservation(roomId: number, checkIn: Date, checkOut: Date, excludeReservationId?: number): Promise<boolean> {
        const conflictingReservation = await this.reservationRepository.findPossibleReservation(
            roomId, 
            checkIn, 
            checkOut, 
            excludeReservationId
        );
        return !!conflictingReservation;
    }
}