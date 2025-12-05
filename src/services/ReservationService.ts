import Room from "../models/Room";
import Reservation, { ReservationCreationAttributes } from "../models/Reservation";
import { User } from "../models/User";
import { ReservationRepository } from "../repository/ReservationRepository";
import { ReservationStatus } from "../enums/ReservationStatus";

export class ReservationService {
    private reservationRepository = new ReservationRepository();
    async create(data: ReservationCreationAttributes): Promise<Reservation> {
        const { userId, roomId, checkIn, checkOut } = data;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const room = await Room.findByPk(roomId);
        const user = await User.findByPk(userId);

        if (!room) throw new Error("Entitade não existe");
        if (!user) throw new Error("Usuário não existe");
        if (checkInDate>checkOutDate) throw new Error("A reserva possui datas inválidas.");

        const isOccupied = await this.checkIfAlreadyHasReservation(roomId, checkInDate, checkOutDate);
        if (isOccupied) {
            throw new Error("O quarto já está ocupado nos dias escolhidos.");
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
            throw new Error("Reserva não encontrada.");
        }
        return reservation;
    }

    async update(id: number, data: Partial<ReservationCreationAttributes>): Promise<Reservation | null> {
        const reservation = await this.getById(id);

        if (reservation.status === ReservationStatus.CANCELED || reservation.status === ReservationStatus.CHECKED_OUT) 
          throw new Error("Não é possível alterar uma reserva cancelada ou finalizada.");

        const newCheckIn = data.checkIn ? new Date(data.checkIn) : reservation.checkIn;
        const newCheckOut = data.checkOut ? new Date(data.checkOut) : reservation.checkOut;
        
        const hasDateChanged = newCheckIn.getTime() !== reservation.checkIn.getTime() || 
                               newCheckOut.getTime() !== reservation.checkOut.getTime();

        if (hasDateChanged) {
            if (newCheckIn >= newCheckOut) {
                throw new Error("A data de check-out deve ser posterior ao check-in.");
            }

            const isOccupied = await this.checkIfAlreadyHasReservation(reservation.roomId, newCheckIn, newCheckOut, id);
            
            if (isOccupied) throw new Error("As novas datas não estão disponíveis para este quarto.");

            const room = await Room.findByPk(reservation.roomId);
            if (!room) {
                throw new Error("Quarto associado à reserva não encontrado.");
            }

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