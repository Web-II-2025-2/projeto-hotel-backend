import { AppError } from "../error/AppError";
import { AuthLoginDTO } from "../models/dtos/AuthLoginDto";
import { AuthRegisterGuestDTO, AuthRegisterEmployeeDTO  } from "../models/dtos/AuthRegisterDto";
import { CredentialRepository } from "../repository/CredentialRepository";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { GuestService } from "./GuestService";
import { EmployeeService } from "./EmployeeService";
import { RoleType } from "../enums/RoleType";

export class AuthService {
    private credentialRepository = new CredentialRepository();
    private guestService = new GuestService();
    private employeeService = new EmployeeService();

    async registerGuest(data: AuthRegisterGuestDTO) {
        const credentialExists = await this.credentialRepository.findByEmail(data.email);
        if (credentialExists) {
            throw new AppError("Email already in use", 409);
        }
        const passwordHash = await hashPassword(data.password);
        const credential = await this.credentialRepository.createCredential(
            data.email,
            passwordHash,
            RoleType.GUEST
        );
        await this.guestService.createGuest({
            name: data.name,
            cpf: data.cpf,
            phoneNumber: data.phoneNumber,
            credentialId: credential.id
        });

        return {
            message: "Guest registered successfully"
        };
    
    }

    async registerEmployee(data: AuthRegisterEmployeeDTO, role: RoleType) {

        const credentialExists = await this.credentialRepository.findByEmail(data.email);
        if (credentialExists) {
            throw new AppError("Email already in use", 409);
        }
        const passwordHash = await hashPassword(data.password);
        const credential = await this.credentialRepository.createCredential(
            data.email,
            passwordHash,
            role
        );
        await this.employeeService.createEmployee({
            name: data.name,
            credentialId: credential.id
        });

        return {
            message: `${role} registered successfully`
        };
    }

    async login(data: AuthLoginDTO) {
        const credential = await this.credentialRepository.findByEmail(data.email);
        if (!credential) {
            throw new AppError("Invalid email or password", 401);
        }
        const isPasswordValid = await comparePassword(
            data.password,
            credential.passwordHash
        );
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }
        const token = generateToken(
            credential.id,
            credential.role
        );
        return token;
    }
}

