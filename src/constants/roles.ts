import { RoleType } from "../enums/RoleType";

export const AccessLevel = {
  ADMIN: [RoleType.ADMIN],

  MANAGER: [RoleType.ADMIN, RoleType.MANAGER],

  EMPLOYEE: [RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE],

  AUTHENTICATED: [RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE, RoleType.GUEST],

  GUEST: [RoleType.GUEST],
};