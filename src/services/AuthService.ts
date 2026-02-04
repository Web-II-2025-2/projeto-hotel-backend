import { AppError } from "../error/AppError";
import { AuthLoginDTO } from "../models/dtos/AuthLoginDto";
import { AuthRegisterDTO } from "../models/dtos/AuthRegisterDto";
import { Person } from "../models/Person";
import { PersonRepository } from "../repository/PersonRepository";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { UserService } from "./UserService";

export class AuthService {
    private personRepository = new PersonRepository();
    private userService = new UserService();

    async register(data: AuthRegisterDTO) {
        try {
            const userExists = await this.personRepository.findByEmail(data.email);
            if (userExists) {
                throw new AppError("Email already in use");
            }
            const user = await this.userService.createUser({
                name: data.name,
                email: data.email,
                cpf: data.cpf,
                phoneNumber: data.phoneNumber
            });
            const passwordHash = await hashPassword(data.password);
            await Person.create(
                {
                    email: data.email,
                    passwordHash,
                    userId: user.id
                },
            );
            return {
                message: "User registered successfully"
            };
        } catch (err) {
            throw err;
        }
    }

    async login(data: AuthLoginDTO) {
        const person = await this.personRepository.findByEmail(data.email);
        if (!person) {
            throw new AppError("Invalid email or password");
        }
        const isPasswordValid = await comparePassword(
            data.password,
            person.passwordHash
        );
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password");
        }
        const token = generateToken(
            person.id,
            person.email
        );
        return token;
    }
}

