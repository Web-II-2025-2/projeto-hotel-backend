import { RoomService } from "./RoomService";
import { GuestService } from "./GuestService";
import { Reservation, ReservationCreationAttributes } from "../models/Reservation";
import { ReservationRepository } from "../repository/ReservationRepository";
import { ReservationStatus } from "../enums/ReservationStatus";
import { AppError } from "../error/AppError";
import { CredentialService } from "./CredentialService";
import { RoleType } from "../enums/RoleType";
import { RoomStatus } from "../enums/RoomStatus";
import logger from "../utils/logger";
export class ReservationService {

    private roomService = new RoomService();
    private guestService = new GuestService();
    private reservationRepository = new ReservationRepository();
    private credentialService = new CredentialService();

    async create(credentialId: number, data: Omit<ReservationCreationAttributes, 'guestId' | 'totalPrice'>): Promise<Reservation> {
        const { roomId, checkIn, checkOut } = data;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        
        const room = await this.roomService.getRoom(roomId);
        const guest = await this.guestService.getGuest(credentialId);
        
        logger.info(`Attempting to create reservation for credential ID: ${credentialId} in room ID: ${roomId} from ${checkInDate} to ${checkOutDate}`);
        
        const isOccupied = await this.checkIfAlreadyHasReservation(roomId, checkInDate, checkOutDate);
        if (isOccupied) {
            throw new AppError("O quarto já está ocupado nos dias escolhidos.", 409);
        }

        const totalPrice = await this.calculateTotalPrice(checkInDate, checkOutDate, roomId);

        const reservation = await this.reservationRepository.create({
            guestId: guest.id,
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice,
            status: ReservationStatus.CONFIRMED
        });

        logger.info(`Reservation created successfully with ID: ${reservation.id} for credential ID: ${credentialId} in room ID: ${roomId} from ${checkInDate} to ${checkOutDate}`);
        
        return reservation;
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

            reservation.totalPrice = await this.calculateTotalPrice(newCheckIn, newCheckOut, reservation.roomId);
        }

        if (data.guestId) reservation.guestId = data.guestId;
        
        reservation.checkIn = newCheckIn;
        reservation.checkOut = newCheckOut;
        
        return await this.reservationRepository.update(id, reservation.get());
    }

    async delete(id: number): Promise<void> {
        const reservation = await this.getById(id);
        reservation.status = ReservationStatus.CANCELED;
        await this.reservationRepository.delete(id);
    }

    async getByGuestId(credentialId: number): Promise<Reservation[]> {
        const guest = await this.guestService.getGuest(credentialId);
        if (!guest) {
            throw new AppError("Hóspede não encontrado.", 404);
        }
        return await this.reservationRepository.findByGuestId(guest.id);
    }

    public async calculateTotalPrice(checkIn: Date, checkOut: Date, roomId: number): Promise<number> {
        const room = await this.roomService.getRoom(roomId);
        
        const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysToCharge = diffDays === 0 ? 1 : diffDays;
        
        return daysToCharge * room.dailyRate;
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

    async markAsCheckedIn(reservationId: number, credentialId: number): Promise<Reservation | null> {
        const reservation = await this.getById(reservationId);
        const guest = await this.guestService.getGuest(credentialId);
        const room = await this.roomService.getRoom(reservation.roomId);

        logger.info(`Attempting to mark reservation ID: ${reservationId} as checked in for credential ID: ${credentialId}`);
        
        if (reservation.guestId !== guest.id) {
             throw new AppError("Você não tem permissão para finalizar esta reserva.", 403);
         }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkInDate = new Date(reservation.checkIn);
        checkInDate.setHours(0, 0, 0, 0);

        const checkOutDate = new Date(reservation.checkOut);
        checkOutDate.setHours(23, 59, 59, 999);
        
        if (today < checkInDate) {
            throw new AppError("Ainda não chegou o período permitido para o seu check-in.", 400);
        }

        if (today > checkOutDate) {
            throw new AppError("O período desta reserva já expirou.", 400);
        }

        reservation.status = ReservationStatus.CHECKED_IN; 
        await this.roomService.updateRoom(reservation.roomId, { 
        ...room.get(),
        status: RoomStatus.OCCUPIED 
        });
        
        logger.info(`Reservation ID: ${reservationId} marked as checked in for credential ID: ${credentialId}`);
        return await this.reservationRepository.update(reservationId, reservation.get());
    }

    async markAsCheckedOut(reservationId: number, credentialId: number): Promise<Reservation | null> {
        const reservation = await this.getById(reservationId);
        const guest = await this.guestService.getGuest(credentialId);
        const room = await this.roomService.getRoom(reservation.roomId);
        
        logger.info(`Attempting to mark reservation ID: ${reservationId} as checked out for credential ID: ${credentialId}`);  
        if (reservation.guestId !== guest.id) {
             throw new AppError("Você não tem permissão para finalizar esta reserva.", 403);
         }
        reservation.status = ReservationStatus.CHECKED_OUT;
        reservation.checkOut = new Date();
        await this.roomService.updateRoom(reservation.roomId, { 
        ...room.get(),
        status: RoomStatus.DIRTY 
        });
        logger.info(`Reservation ID: ${reservationId} marked as checked out for credential ID: ${credentialId}`);
        return await this.reservationRepository.update(reservationId, reservation.get());
    }
}