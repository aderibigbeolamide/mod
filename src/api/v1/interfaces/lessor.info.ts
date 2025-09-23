import { LessorCategories } from "../enums/lessor.categories.enum.js";

export interface LessorInfo {
  id: string;
  lessorCategory: LessorCategories;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  agencyName: string;
}
