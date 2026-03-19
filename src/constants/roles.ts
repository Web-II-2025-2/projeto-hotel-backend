import { RoleType } from "../enums/RoleType";

export const AccessLevel = {
  ADMIN: [RoleType.ADMIN],

  MANAGER: [RoleType.ADMIN, RoleType.MANAGER],

  EMPLOYEE: [RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE],

  AUTHENTICATED: [RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE, RoleType.GUEST],

  GUEST: [RoleType.GUEST],
};

export const RoleHierarchy = {
  [RoleType.ADMIN]: 4,
  [RoleType.MANAGER]: 3,
  [RoleType.EMPLOYEE]: 2,
  [RoleType.GUEST]: 1,
};