import { RoleType } from "../enums/RoleType";
import { Credential, CredentialAttributes } from "../models/Credential";

export class CredentialRepository {

    async findByEmail(email: string): Promise<Credential | null> {
        return await Credential.findOne({ where: { email } });
    }

    async createCredential(
        email: string,
        passwordHash: string,
        role: RoleType
    ): Promise<Credential> {
        const credential = await Credential.create({
            email,
            passwordHash,
            role
        });
        return credential;
    }

    async getCredential(id: number): Promise<Credential | null> {
        return await Credential.findByPk(id);
    }

    async updateCredential(
        id: number,
        data: Partial<CredentialAttributes>
    ): Promise<Credential | null> {
        const credential = await Credential.findByPk(id);
        if (!credential) return null;

        await credential.update(data);
        return credential;
    }

    async getAllCredentials(): Promise<Credential[]> {
        return await Credential.findAll();
    }

    async deleteCredential(id: number): Promise<number> {
        return await Credential.destroy({ where: { id } });
    }
}
