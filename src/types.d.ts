import { User } from "./api/v1/interfaces/user.interface.ts";

declare module "express-serve-static-core" {
  export interface Request {
    sender?: User;
    user?:{
      email: string;
      id: string;
    }
  }
}
