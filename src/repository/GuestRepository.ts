import { Guest } from "../models/Guest";

export class GuestRepository {

  async createGuest(name: string, cpf: string, phoneNumber: string, credentialId: number) {
    const guest = await Guest.create({
        name,
        cpf,
        phoneNumber,
        credentialId
    });
    return guest;
  }

  async getGuest(id_credential: number) {
    return await Guest.findOne({ where: { credentialId: id_credential } });
  }

  async updateGuest(guest: Guest, data: Partial<Guest>) {
    await guest.update(data);
    return guest;
  }

  async getAllGuests() {
    return await Guest.findAll();
  }

  async deleteGuest(id_credential: number) {
    return await Guest.destroy({where: { credentialId: id_credential }});
  }
}
