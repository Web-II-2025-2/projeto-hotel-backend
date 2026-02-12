import { AppError } from "../error/AppError";
import { CredentialRepository } from "../repository/CredentialRepository";

export class CredentialService {
    
  private credentialRepository = new CredentialRepository();

  async getCredentialById(id: number) {
    const credential = await this.credentialRepository.findById(id);
    if (!credential) {
      throw new AppError("Credential not found", 404);
    }
    return credential;
  }

  //TODO: Update credential and delete credential methods may be added here

}