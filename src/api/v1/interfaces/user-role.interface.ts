import { UserRoles } from "../enums/user.roles.enum.js";
import { UserInfo } from "./user-info.interface.js";

export interface UserRole {
    role: UserRoles,
    label: string,
    config: string,
    info: UserInfo
}