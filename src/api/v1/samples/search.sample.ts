import { SortDirection, SearchQuery } from "../interfaces/search.interface.js";

export namespace SearchSample {
  export const searchQuery: SearchQuery = {
    createdBy: "",
    createdFrom: "",
    createdTo: "",
    pageNumber: 1,
    pageSize: 1,
    sortDirection: SortDirection.asc,
    sortField: "",
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  export const sortDirections: SortDirection[] = Object.values(SortDirection);
}
