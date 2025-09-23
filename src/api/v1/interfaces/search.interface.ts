import { SearchCondition } from "../enums/search.enum.js";

export interface SearchQuery<TResultRow = any> {
  pageNumber?: number;
  pageSize?: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageUrl?: string;
  previousPageUrl?: string;
  sortField?: keyof TResultRow;
  sortDirection?: SortDirection;
  createdFrom?: string;
  createdTo?: string;
  createdAt?: string;
  createdBy?: string;
  [key: string]: any;
}

export interface SearchResponse<TResultRow = any> extends SearchQuery {
  data: TResultRow[];
  total: number;
}

export const SortDirection = {
  asc: "ASC",
  desc: "DESC",
};
export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];


export interface SearchQueryItem<T> {
  // /** This is not used by the search engine. It is only used for descriptive purposes */
  // publicField?: keyof T;
  field: keyof T;
  subFields?: string[];
  upperRange?: keyof T;
  lowerRange?: keyof T;
  // actualField?: keyof T;
  condition?: SearchCondition;
}
