import { RoleType } from "../enums/RoleType";
import { Credential } from "../models/Credential";
import { hashPassword } from "../utils/auth";

export async function createInitialAdmin() {
  const exists = await Credential.findOne({
    where: { role: RoleType.ADMIN },
  });

  if (exists) return;

  await Credential.create({
    email: "adminJoseGlauber@hotel.com",
    passwordHash: await hashPassword("JoseGlauber@123"),
    role: RoleType.ADMIN,
  });

  console.log("Admin inicial criado");
}