import { LessorSearchQueryDto } from "../dtos/lessor.dto.js";
import { LessorCategories } from "../enums/lessor.categories.enum.js";
import { SearchSample } from "./search.sample.js";

export namespace LessorSample {
  export const searchQuery: LessorSearchQueryDto = {
    lessorCategory: LessorCategories.LANDLORD,
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@mail.com',
    phoneNumber: '08208339281',
    agencyName: 'agencyName',
    ...SearchSample.searchQuery,
    sortField: "agencyName",
  };
}
