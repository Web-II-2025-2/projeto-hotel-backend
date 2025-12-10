import { UserRepository } from "../repository/UserRepository";
import { AppError } from "../error/AppError";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(data: {
    name: string;
    email: string;
    cpf: string;
    phoneNumber: string;
  }) {

    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError('Este e-mail já está sendo utilizado.', 409);
    }
    
    return await this.userRepository.createUser(
      data.name,
      data.email,
      data.cpf,
      data.phoneNumber
    );
  }

  async getUser(id: number) {
    const user = await this.userRepository.getUser(id);
    if (!user) {
        throw new AppError('User not found.', 404);
    }
    return user;
  }

  async updateUser(id: number, data: any) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists && userAlreadyExists.id !== id) {
      throw new AppError('Este e-mail já está sendo utilizado.', 409);
    }
    
    const user = await this.userRepository.updateUser(id, data);
    if (!user) {
        throw new AppError('User not found.', 404);
    }
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async deleteUser(id: number) {
    const deleted = await this.userRepository.deleteUser(id);
    if (!deleted) {
        throw new AppError('User not found.', 404);
''    }
    return true;
  }
}
