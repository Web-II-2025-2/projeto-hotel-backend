import { Request } from "express"
import { RoleType } from "../enums/RoleType";

export interface UserAuthRequest extends Request {
  user: {
    id: number;
    role: RoleType;
  }
}
