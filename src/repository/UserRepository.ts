import { User } from "../models/User";

export class UserRepository {

  async createUser(name: string, email: string, cpf: string, phoneNumber: string) {
    const user = await User.create({
        name,
        email,
        cpf,
        phoneNumber,
    });
    return user;
  }

  async getUser(id: number) {
    return await User.findByPk(id);
  }

  async updateUser(id: number, data: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) return null; 
    await user.update(data);
    return user;
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async deleteUser(id: number) {
    return await User.destroy({where: { id }});
  }
}
