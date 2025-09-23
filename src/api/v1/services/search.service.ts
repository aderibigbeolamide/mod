// import { EntityTarget } from "typeorm";
// import { dataSource } from "../../../config/database.config.js";
// import {
//   SortDirection,
//   SearchQuery,
//   SearchQueryItem,
//   SearchResponse,
// } from "../interfaces/search.interface.js";
// import { ISwaggerParameter } from "../interfaces/swagger.interface.js";
// import { SearchSample } from "../samples/search.sample.js";
// import { SearchCondition } from "../enums/search.enum.js";
// import dotenv from "dotenv";
// import { Request } from "express";

// dotenv.config();

// export default class SearchService {
//   static searchStructToObject = <T>(struct: SearchQueryItem<T>[]): SearchQuery<T> => {
//     const obj: Partial<SearchQuery<T>> = {};
//     for (const item of struct) {
//       if (item.lowerRange) {
//         obj[item.lowerRange as keyof SearchQuery<T>] = null;
//         obj[item.upperRange as keyof SearchQuery<T>] = null;
//       } else {
//         obj[item.field as keyof SearchQuery<T>] = null;
//       }
//     }
//     return {
//       totalPages: 0,
//       hasNextPage: false,
//       hasPreviousPage: false,
//       data: [],
//       total: 0,
//       pageSize: 10,
//       pageNumber: 1,
//       sortField: "createdAt",
//       sortDirection: SortDirection.desc,
//       ...obj,
//     } as SearchQuery<T>;
//   };

//   static structToQueryParams = <T>(struct: SearchQueryItem<T>[]): ISwaggerParameter[] => {
//     return this.queryParams(this.searchStructToObject(struct));
//   };

//   static queryParams = (obj: SearchQuery = SearchSample.searchQuery): ISwaggerParameter[] => {
//     return Object.keys({ ...obj, ...SearchSample.searchQuery })
//       .sort()
//       .map<ISwaggerParameter>((q) => ({
//         name: q,
//         in: "query",
//         required: false,
//       }));
//   };

//   static defaultQueryStruct: SearchQueryItem<SearchQuery<any>>[] = [
//     {
//       condition: SearchCondition.between,
//       lowerRange: "createdFrom",
//       upperRange: "createdTo",
//       field: "createdAt",
//       fieldName: "createdAt",
//       valueType: undefined
//     },
//     {
//       condition: SearchCondition.equal,
//       field: "createdBy",
//       fieldName: "createdBy",
//       valueType: undefined
//     },
//   ];

//   static async search<TSearchQuery extends SearchQuery<any>, TEntity>(
//     entity: { entity?: EntityTarget<TEntity>; tableName: string; queryBuilderCustomizer?: (qb: any) => void },
//     queryStruct: SearchQueryItem<TSearchQuery>[],
//     query: TSearchQuery,
//     relations: { columnName: string; tableName: string }[] = [],
//     useFrontendUrl: boolean = false,
//     req?: Request
//   ): Promise<SearchResponse<TEntity>> {
//     const tableName = entity.tableName;
//     let queryBuild = dataSource.getRepository(entity.entity).createQueryBuilder(tableName);

//     queryStruct.concat(this.defaultQueryStruct).forEach((queryParam, idx) => {
//       const paramName = `${String(queryParam.field)}_${idx}`;
//       const fieldValue: any = query[queryParam.field as keyof TSearchQuery];

//       // detect valueType automatically if not set
//       let valueType = queryParam.valueType;
//       if (!valueType) {
//         if (typeof fieldValue === 'boolean' || fieldValue === 'true' || fieldValue === 'false') {
//           valueType = 'boolean';
//         } else if (!isNaN(Number(fieldValue))) {
//           valueType = 'number';
//         }
//       }

//       // --- build dbColumn safely ---
//       const rawFieldName = queryParam.fieldName;
//       const dbColumn =
//         (typeof rawFieldName === 'string' && rawFieldName.trim() !== '')
//           ? rawFieldName.trim()
//           : String(queryParam.field);

//       if (!dbColumn) {
//         throw new Error(`No column name supplied for ${JSON.stringify(queryParam)}`);
//       }

//       // --- build prefix before using it ---
//       let prefix: string;
//       if (queryParam.subFields?.length) {
//         const column = `${tableName}.${dbColumn}`;
//         const keys = queryParam.subFields;
//         const jsonPath = keys.slice(0, -1).reduce((acc, k) => `${acc}->'${k}'`, column);
//         // ->> already returns text, no need for ::boolean here
//         prefix = `${jsonPath}->>'${keys[keys.length - 1]}'`;
//       } else {
//         prefix = `${tableName}.${dbColumn}`;
//         // only cast normal column to boolean
//         if (valueType === 'boolean' && queryParam.condition !== SearchCondition.contains) {
//           prefix = `${prefix}::boolean`;
//         }
//       }

//       // --- now you can safely switch on condition using prefix ---
//       switch (queryParam.condition) {
//         case SearchCondition.contains:
//           if (valueType === 'boolean') {
//             queryBuild.andWhere(`${prefix} = :${paramName}`, { [paramName]: fieldValue });
//           } else {
//             queryBuild.andWhere(`${prefix} ILIKE :${paramName}`, { [paramName]: `%${fieldValue}%` });
//           }
//           break;

//         case  SearchCondition.equal:
//           if (valueType === 'boolean') {
//             // If it's JSON we left prefix as text, so pass 'true'/'false'
//             queryBuild.andWhere(`${prefix} = :${paramName}`, {
//               [paramName]: queryParam.subFields?.length ? (fieldValue ? 'true' : 'false') : fieldValue
//             });
//           } else {
//             queryBuild.andWhere(`${prefix} = :${paramName}`, { [paramName]: fieldValue });
//           }
//           break;


//         case SearchCondition.inArray:
//           if (queryParam.subFields?.length) {
//             queryBuild.andWhere(`(${prefix})::jsonb ? :${paramName}`, { [paramName]: fieldValue });
//           } else {
//             queryBuild.andWhere(`:${paramName} = ANY(${prefix})`, { [paramName]: fieldValue });
//           }
//           break;

//         case SearchCondition.between:
//           const lower = query[queryParam.lowerRange as keyof TSearchQuery];
//           const upper = query[queryParam.upperRange as keyof TSearchQuery];
//           queryBuild.andWhere(
//             `CAST(${prefix} AS NUMERIC) BETWEEN :${paramName}_lower AND :${paramName}_upper`,
//             { [`${paramName}_lower`]: lower, [`${paramName}_upper`]: upper }
//           );
//           break;
//       }
//     });

//     // Sorting + paging
//     query.sortField = query.sortField || 'createdAt';
//     query.sortDirection = (query.sortDirection?.toUpperCase() as any) || SortDirection.desc;
//     const pageNumber = parseInt(query.pageNumber as any, 10) || 1;
//     const pageSize = parseInt(query.pageSize as any, 10) || 8;

//     queryBuild
//       .orderBy(`${tableName}.${String(query.sortField)}`, query.sortDirection as any)
//       .addOrderBy(`${tableName}.createdAt`, 'DESC')
//       .skip(pageSize * (pageNumber - 1))
//       .take(pageSize + 1);

//     // Join relations dynamically
//     for (const rel of relations) {
//       queryBuild.leftJoinAndSelect(`${tableName}.${rel.columnName}`, rel.tableName);
//     }

//     const [result, total] = await queryBuild.getManyAndCount();
//     const hasMore = result.length > pageSize;
//     if (hasMore) result.pop();

//     const totalPages = Math.ceil(total / pageSize);

//     const urlParams = new URLSearchParams();
//     Object.entries(query).forEach(([key, value]) => {
//       if (value !== undefined && key !== 'pageNumber') {
//         urlParams.append(key, String(value));
//       }
//     });
//     urlParams.append('pageSize', String(pageSize));

//     const cleanUrlParams = new URLSearchParams(urlParams);
//     cleanUrlParams.delete('totalPages');
//     cleanUrlParams.delete('hasNextPage');
//     cleanUrlParams.delete('hasPreviousPage');

//     const baseUrl =
//       useFrontendUrl
//         ? process.env.WEB_APP_URL
//         : req?.protocol + '://' + req?.get('host') + req?.originalUrl?.split('?')[0];

//     const constructUrl = (pageNum: number) => {
//       const newParams = new URLSearchParams(cleanUrlParams.toString());
//       newParams.set('pageNumber', String(pageNum));
//       return `${baseUrl}?${newParams.toString()} `;
//     };

//     const nextPageUrl = hasMore && pageNumber < totalPages ? constructUrl(pageNumber + 1) : null;
//     const previousPageUrl = pageNumber > 1 ? constructUrl(pageNumber - 1) : null;

//     return {
//       pageNumber,
//       pageSize,
//       sortDirection: query.sortDirection as SortDirection,
//       sortField: String(query.sortField),
//       hasNextPage: hasMore,
//       hasPreviousPage: pageNumber > 1,
//       nextPageUrl,
//       previousPageUrl,
//       data: result,
//       total,
//       totalPages,
//     };
//   }
// }

import { EntityTarget } from "typeorm";
import { dataSource } from "../../../config/database.config.js";
import {
  SortDirection,
  SearchQuery,
  SearchQueryItem,
  SearchResponse,
} from "../interfaces/search.interface.js";
import { ISwaggerParameter } from "../interfaces/swagger.interface.js";
import { SearchSample } from "../samples/search.sample.js";
import { SearchCondition } from "../enums/search.enum.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default class SearchService {
  static searchStructToObject = <T>(struct: SearchQueryItem<T>[]): SearchQuery<T> => {
    const obj: Partial<SearchQuery<T>> = {};

    for (const item of struct) {
      if (item.lowerRange) {
        obj[item.lowerRange as keyof SearchQuery<T>] = null;
        obj[item.upperRange as keyof SearchQuery<T>] = null;
      } else {
        obj[item.field as keyof SearchQuery<T>] = null;
      }
    }

    return {
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      data: [],
      total: 0,
      pageSize: 10,
      pageNumber: 1,
      sortField: "createdAt",
      sortDirection: SortDirection.desc,
      ...obj,
    } as SearchQuery<T>;
  };

  static structToQueryParams = <T>(struct: SearchQueryItem<T>[]): ISwaggerParameter[] => {
    return this.queryParams(this.searchStructToObject(struct));
  };

  static queryParams = (obj: SearchQuery = SearchSample.searchQuery): ISwaggerParameter[] => {
    return Object.keys({ ...obj, ...SearchSample.searchQuery })
      .sort()
      .map<ISwaggerParameter>((q) => ({
        name: q,
        in: "query",
        required: false,
      }));
  };

  static defaultQueryStruct: SearchQueryItem<SearchQuery<any>>[] = [
    {
      condition: SearchCondition.between,
      lowerRange: "createdFrom",
      upperRange: "createdTo",
      field: "createdAt",
    },
    {
      condition: SearchCondition.equal,
      field: "createdBy",
    },
  ];

  static async search<TSearchQuery extends SearchQuery<any>, TEntity>(
    entity: { entity?: EntityTarget<TEntity>; tableName: string },
    queryStruct: SearchQueryItem<TSearchQuery>[],
    query: TSearchQuery,
    relations: { columnName: string; tableName: string }[] = [],
    useFrontendUrl: boolean = false
  ): Promise<SearchResponse<TEntity>> {
    const tableName = entity.tableName;
    let queryBuild = dataSource.getRepository(entity.entity).createQueryBuilder(tableName);
    // Always filter for complete properties
    if (tableName === 'property') {
      queryBuild.andWhere(`${tableName}.is_complete = :isComplete`, { isComplete: true });
    }
    queryStruct.concat(this.defaultQueryStruct).forEach((queryParam) => {
      const hasValue =
        query[queryParam.field as keyof TSearchQuery] != null ||
        query[queryParam.upperRange as keyof TSearchQuery] != null ||
        query[queryParam.lowerRange as keyof TSearchQuery] != null;

      if (!hasValue) return;

      let prefix = `${tableName}.${queryParam.field?.toString()}`;
      if (queryParam.subFields?.length) {
        prefix = `${tableName}.${queryParam.subFields[0]} ${queryParam.subFields
          .slice(1)
          .map((x, index) => `->${index + 2 == queryParam.subFields.length ? ">" : ""} '${x?.toString()}'`)
          .join(" ")}`;
      }

      const fieldValue = query[queryParam.field as keyof TSearchQuery];

      if (queryParam.condition === SearchCondition.contains) {
        queryBuild.andWhere(`${prefix} ILIKE :value`, { value: `%${fieldValue}%` });
      } else if (queryParam.condition === SearchCondition.fuzzy) {
        queryBuild.andWhere(`to_tsvector('english', ${prefix}::text) @@ plainto_tsquery('english', :value)`, { value: fieldValue });
      } else if (queryParam.condition === SearchCondition.inArray) {
        if (queryParam.subFields?.length) {
          queryBuild.andWhere(`(${prefix})::jsonb ? :value`, { value: fieldValue });
        } else {
          queryBuild.andWhere(`:value = ANY(${prefix})`, { value: fieldValue });
        }
      } else if (queryParam.condition === SearchCondition.between) {
        const lower = query[queryParam.lowerRange as keyof TSearchQuery];
        const upper = query[queryParam.upperRange as keyof TSearchQuery];

        // Cast to NUMERIC for safe numeric comparisons
        queryBuild.andWhere(
          `CAST(${prefix} AS NUMERIC) BETWEEN :lower AND :upper`,
          { lower, upper }
        );
      } else {
        queryBuild.andWhere(`${prefix} ${queryParam.condition || "="} :value`, { value: fieldValue });
      }
    });

    // Sorting
    query.sortField = query.sortField || "createdAt";
    query.sortDirection = (query.sortDirection?.toUpperCase() as any) || SortDirection.desc;
    const pageNumber = parseInt(query.pageNumber as any, 10) || 1;
    const pageSize = parseInt(query.pageSize as any, 10) || 8;

    queryBuild
      .orderBy(`${tableName}.${String(query.sortField)}`, query.sortDirection as any)
      .addOrderBy(`${tableName}.createdAt`, "DESC") // Fallback sort if values are equal
      .skip(pageSize * (pageNumber - 1))
      .take(pageSize + 1); // Fetch one extra record to check for `hasMore`

    // Join relations
    for (let relation of relations) {
      queryBuild.leftJoinAndSelect(`${tableName}.${relation.columnName}`, relation.tableName);
    }

    const result = await queryBuild.getMany();
    const hasMore = result.length > pageSize;
    if (hasMore) result.pop();

    const total = await dataSource.getRepository(entity.entity).count();
    const totalPages = Math.ceil(total / pageSize);

    const baseUrl = useFrontendUrl ? process.env.WEB_APP_URL : process.env.API_HOST;

    // Construct pagination URLs
    const urlParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && key !== "pageNumber") {
        urlParams.append(key, String(value));
      }
    });
    urlParams.append("pageSize", String(pageSize));

    const cleanUrlParams = new URLSearchParams(urlParams);
    cleanUrlParams.delete("totalPages");
    cleanUrlParams.delete("hasNextPage");
    cleanUrlParams.delete("hasPreviousPage");

    const constructUrl = (pageNum: number) =>
      `${baseUrl}/api/v1/property/search?pageNumber=${pageNum}&${cleanUrlParams.toString()}`;

    const nextPageUrl = hasMore && pageNumber < totalPages ? constructUrl(pageNumber + 1) : null;
    const previousPageUrl = pageNumber > 1 ? constructUrl(pageNumber - 1) : null;

    return {
      pageNumber,
      pageSize,
      sortDirection: query.sortDirection as SortDirection,
      sortField: String(query.sortField),
      hasNextPage: hasMore,
      hasPreviousPage: pageNumber > 1,
      nextPageUrl,
      previousPageUrl,
      data: result,
      total,
      totalPages,
    };
  }
}
