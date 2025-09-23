import { UserRoles } from "../enums/user.roles.enum.js";

export interface User {
  id: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  detailsId: string;
  role: UserRoles;
  isActive: boolean;
  signInType: string;
}
