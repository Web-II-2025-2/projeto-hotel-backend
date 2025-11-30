import { UserRepository } from "../repository/UserRepository";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(data: {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
  }) {
    return await this.userRepository.createUser(
      data.name,
      data.email,
      data.cpf,
      data.phoneNumber
    );
  }

  async getUser(id: number) {
    const user = await this.userRepository.getUser(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id: number, data: any) {
    const user = await this.userRepository.updateUser(id, data);
    if (!user) throw new Error("User not found");
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async deleteUser(id: number) {
    const deleted = await this.userRepository.deleteUser(id);
    if (!deleted) throw new Error("User not found");
    return true;
  }
}
