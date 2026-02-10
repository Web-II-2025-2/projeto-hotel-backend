import { GuestRepository } from "../repository/GuestRepository";
import { AppError } from "../error/AppError";

export class GuestService {
  private guestRepository = new GuestRepository();

  async createGuest(data: {
    name: string;
    cpf: string;
    phoneNumber: string;
    credentialId: number;
  }) {

    return await this.guestRepository.createGuest(
      data.name,
      data.cpf,
      data.phoneNumber,
      data.credentialId
    );
  }

  async getGuest(id: number) {
    const guest = await this.guestRepository.getGuest(id);
    if (!guest) {
        throw new AppError('Guest not found.', 404);
    }
    return guest;
  }

  async updateGuest(id: number, data: any) {
    const guest = await this.guestRepository.updateGuest(id, data);
    if (!guest) {
        throw new AppError('Guest not found.', 404);
    }
    return guest;
  }

  async getAllGuests() {
    return await this.guestRepository.getAllGuests();
  }

  async deleteGuest(id: number) {
    const deleted = await this.guestRepository.deleteGuest(id);
    if (!deleted) {
        throw new AppError('Guest not found.', 404);
    }
    return true;
  }
}
