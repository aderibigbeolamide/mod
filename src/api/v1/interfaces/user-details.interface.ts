import { UserInfo } from "./user-info.interface.js";

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  isVerified: boolean;
  verificationDate: Date;
  profilePictureUrl: string;
  userInfo: UserInfo;
}
