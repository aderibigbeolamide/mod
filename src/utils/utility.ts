import { Repository } from "typeorm";
import { EErrorCode } from "../api/v1/enums/errors.enum.js";
import { HttpException } from "../api/v1/exceptions/http.exception.js";
import { IErrorStructure } from "../api/v1/interfaces/error.interface.js";
import { Routes } from "../api/v1/interfaces/routes.interface.js";
import { ISwaggerParameter } from "../api/v1/interfaces/swagger.interface.js";
import { ERROR_CODE_400, STATUS_ERROR, STATUS_SUCCESS } from "../config/constants.js";
import { logger } from "../config/logger.js";
import { Swagger } from "../swagger.js";
import { Request, Response, NextFunction, Router } from "express";
import { validate as cv_validate } from "class-validator";
// import { ClassConstructor, plainToClass } from "class-transformer";

namespace Utility {
  /**
   * Hide sensitive properties in obj
   * @param obj
   * @returns
   */
  export function hideSensitive(obj: any): any {
    delete obj.password;
    delete obj.randomSensitiveInfo;
    return obj;
  }

  /**
   * Convert string to corresponding enum value
   * @param enumObj
   * @param value
   * @returns
   */
  export function stringToEnum<T>(enumObj: T, value: string): T[keyof T] | undefined {
    const enumKeys = Object.keys(enumObj) as (keyof T)[];
    const enumValues = enumKeys.map((key) => enumObj[key]);

    const index = enumValues.indexOf(value as T[keyof T]);
    if (index !== -1) {
      return enumValues[index];
    }

    return undefined;
  }

  export const swaggerRouteToAppRoute = <
    TController extends {
      [x: string]: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    }
  >(config: {
    path: string;
    controller: TController;
    routes: Swagger.IRoute<TController>[];
  }): (() => Routes) => {
    return () => {
      const router = Router();
      for (const route of config.routes) {
        route.groupName = route.groupName || config.path?.toUpperCase();
        router[route.method](
          route.route + "",
          route.middleWares || [],
          route.handlerName ? config.controller[route.handlerName] : route.handler
        );
        route.route = config.path + route.route;
        Swagger.swaggerRoutes.push(route);
      }
      return { path: config.path, router };
    };
  };

  /**
   *
   * @param res {@link express | Response}
   * @param data
   */
  export function sendResponse(
    res: Response,
    data?: {
      status?: string;
      message?: string;
      data?: any;
      code?: number;
    }
  ) {
    res.status(data?.code || 200).json({
      status: data?.status || STATUS_SUCCESS,
      message: data?.message || "Success",
      data: data?.data,
    });
  }

  export const responseFormatter = <T>(data: T, message = "Success") => ({
    status: STATUS_SUCCESS,
    message,
    data,
  });

  /**
   * Pick fields from a source object and assign them to target
   * @param source Source Object
   * @param target Target object
   * @param fields Fields to pick from source
   */
  export const pickFieldsFromObject = <T = any>(
    source: any,
    target: T,
    fields: { [k in keyof T]: T[k] }
  ) => {
    if (source) for (const field in fields) target[field] = source[field];
  };

  // export function objectToClass = <T, V>(cls: ClassConstructor<T>, source: V, target?: T) => {
  //   if (!source) return;
  //   const inst = plainToClass(cls, source, {
  //     excludeExtraneousValues: true,
  //     // enableCircularCheck: true,
  //   });
  //   if (target) {
  //     for (const field in inst) target[field] = inst[field];
  //     return target;
  //   }
  //   return inst;
  // };

  /**
   * Log an error using Winston
   * @param errorObject
   * @param description
   */
  export const logError = (errorObject: {}, description?: string) => {
    logger.error(JSON.stringify({ description, error: errorObject }));
  };

  export const returnError = (res: Response, error: HttpException) => {
    logger.error(JSON.stringify(error));
    res.status(error?.statusNo || 500).json({
      status: STATUS_ERROR,
      message: error?.message || "Something went wrong",
      errorCode: error?.errorCode || ERROR_CODE_400,
      errors: error?.errors,
    });
  };

  export const throwException = (error: IErrorStructure) => {
    throw new HttpException(
      error.statusNo || 400,
      STATUS_ERROR,
      error.message,
      error.errorCode || EErrorCode.ERROR_CODE_000,
      Array.isArray(error?.errorObject) ? error?.errorObject : [error?.errorObject]
    );
  };
  /**
   * Check if the specified keys have values in an object
   * @param obj Object to check
   * @param requiredKeys Fields to check in object @default All the fields in the object
   */
  export const checkRequiredFields = <T extends { [x: string]: any }>(
    obj: T,
    requiredKeys: (keyof T)[] = Object.keys(obj)
  ) => {
    const missingFields: (keyof T)[] = [];
    for (const key of requiredKeys) if (obj[key] == null) missingFields.push(key);
    if (missingFields?.length)
      throw new HttpException(
        400,
        STATUS_ERROR,
        `${missingFields.join(", ")} ${missingFields.length == 1 ? "is" : "are"} required`,
        EErrorCode.ERROR_CODE_400
      );
  };

  export const generateFee = () => {
    return +(Math.random() * 1000000).toFixed(2);
  };
  export const generateCount = (max = 10000) => {
    return Math.round(Math.random() * max);
  };

  /**
   * Generate swagger path parameters for the route config
   * @param obj Sample data
   * @returns
   */
  export const swaggerPathParams = (obj): ISwaggerParameter[] => {
    return Object.keys(obj)
      .sort()
      .map<ISwaggerParameter>((q) => ({
        name: ":" + q,
        in: "path",
        required: false,
      }));
  };

  /**
   * Generate swagger query parameters for the route config
   * @param obj Sample data
   * @returns
   */
  export const queryParams = (obj): ISwaggerParameter[] => {
    return Object.keys(obj)
      .sort()
      .map<ISwaggerParameter>((q) => ({
        name: q,
        in: "query",
        required: false,
      }));
  };
  /**
   * Use Class Validator to validate payload
   * @param dto
   */
  export const validate = async <T extends object>(dto: T) => {
    const errors = await cv_validate(dto, { whitelist: true, forbidUnknownValues: false });
    if (errors?.length)
      throwException({
        statusNo: 400,
        errorObject: errors.map(({ target, ...rest }) => rest),
        // errorObject: errors.map((rest) => rest),
        message: "Validation error",
        errorCode: EErrorCode.ERROR_CODE_400,
      });
  };

  export const generateUUID = () => {
    let d = new Date().getTime();
    let d2 =
      (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  export async function verifyID<T extends { id: string }>(repo: Repository<T>, id: string) {
    try {
      const res = await repo.find({ select: { id: true } as any, where: { id } as any });
      return !!res[0];
    } catch (error) {
      throwException({
        statusNo: 500,
        message: "An error occured while verifying the ID " + id,
        errorObject: error,
      });
    }
  }

  /**
   * Converts an array to a key value pair.
   * @param arr Array to be converted
   * @param keyField The field to be used as the key
   * @returns An index object containing the keyField as the index key and each item of the array as value assigned to each index
   */
  export function arrayToMap<T>(arr: T[], keyField: keyof T): { [x: string]: T };
  export function arrayToMap<T, NT>(
    arr: T[],
    keyField: keyof T,
    map: (item: T) => NT
  ): { [x: string]: NT };
  export function arrayToMap<T, NT>(arr: T[], keyField: keyof T, map?: (item: T) => NT) {
    const ret: { [x: string]: T | NT } = {};
    for (const iterator of arr) {
      ret[iterator[keyField?.toString()]] = map ? map(iterator) : iterator;
    }
    return ret;
  }

  export function generateReference() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    return `${year}${month}${day}${randomNum}`;
  }
}

export default Utility;
