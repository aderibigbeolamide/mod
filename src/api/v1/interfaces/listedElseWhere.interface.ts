import { UserEntity } from "../entities/user.entity.js";
import { BaseInterface } from "./base.interface.js";

export interface ListedElseWhere extends BaseInterface {
  id: string;
  userId: string;
  propertyLink: string;
  propertyAddress: string;
  description?: string;
  user?: UserEntity;
}

export interface CreateListedElseWhereDto {
  propertyLink: string;
  propertyAddress: string;
  description?: string;
}
