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

  async getGuest(id: number) {
    return await Guest.findByPk(id);
  }

  async updateGuest(id: number, data: Partial<Guest>) {
    const guest = await Guest.findByPk(id);
    if (!guest) return null; 
    await guest.update(data);
    return guest;
  }

  async getAllGuests() {
    return await Guest.findAll();
  }

  async deleteGuest(id: number) {
    return await Guest.destroy({where: { id }});
  }
}
