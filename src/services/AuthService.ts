import { AppError } from "../error/AppError";
import { AuthLoginDTO } from "../models/dtos/AuthLoginDto";
import { AuthRegisterGuestDTO, AuthRegisterEmployeeDTO  } from "../models/dtos/AuthRegisterDto";
import { CredentialRepository } from "../repository/CredentialRepository";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";
import { GuestService } from "./GuestService";
import { EmployeeService } from "./EmployeeService";
import { RoleType } from "../enums/RoleType";
import { RoleHierarchy } from "../constants/roles";
import logger from "../utils/logger";

export class AuthService {
    private credentialRepository = new CredentialRepository();
    private guestService = new GuestService();
    private employeeService = new EmployeeService();

    async registerGuest(data: AuthRegisterGuestDTO) {

        logger.info(`Attempting to register guest with email: ${data.email}`);
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

        logger.info(`Guest registered successfully with email: ${data.email}`);
        return {
            message: "Guest registered successfully"
        };
    
    }

    async registerEmployee(data: AuthRegisterEmployeeDTO, role: RoleType) {

        logger.info(`Attempting to register employee with email: ${data.email}`);
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

        logger.info(`Employee registered successfully with email: ${data.email} and role: ${role}`);
        return {
            message: `${role} registered successfully`
        };
    }

    async login(data: AuthLoginDTO) {
        logger.info(`Attempting to login with email: ${data.email}`);
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
        logger.info(`Login successful for email: ${data.email}`);
        return token;
    }

    async updateRole(targetEmail: string, newRole: RoleType, requesterId: number, requesterRole: RoleType) {
        logger.info(`Attempting to update role for user with email: ${targetEmail} to ${newRole} by requester with ID: ${requesterId} and role: ${requesterRole}`);
        const targetUser = await this.credentialRepository.findByEmail(targetEmail);
        if (!targetUser) {
            throw new AppError("User not found", 404);
        }
        if (targetUser.id === requesterId) {
            throw new AppError("You cannot change your own role", 400);
        }
        if (RoleHierarchy[requesterRole] <= RoleHierarchy[targetUser.role]) {
            throw new AppError("You do not have permission to change this user's role", 403);
        }
        const updatedCredential = await this.credentialRepository.updateCredential(targetUser.id, {role: newRole,});
        logger.info(`Role updated successfully for user with email: ${targetEmail} to ${newRole} by requester with ID: ${requesterId}`);
        return updatedCredential;
        }
}
