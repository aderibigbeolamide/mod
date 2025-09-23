import { v1Base } from "./config/constants.js";
import {
  IContentType,
  ISwaggerParameter,
  ISwaggerPath,
  ISwaggerSchema,
} from "./api/v1/interfaces/swagger.interface.js";

export namespace Swagger {
  export const swaggerRoutes: IRoute<any>[] = [];
  export const authKey = "api_key";

  export function pathGen(
    routes: IRoute<{
      [x: string]: IController;
    }>[] = swaggerRoutes.sort((a, b) => a.route.localeCompare(b.route))
  ): ISwaggerPath {
    const paths: ISwaggerPath = {};
    const dataToSchema = (data: any) => {
      const properties: ISwaggerPath[""]["get"]["responses"][""]["content"]["application/json"]["schema"]["properties"] =
        {};
      if (data) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const val = data[key];
            properties[key] = {
              type: typeof val as any,
              example: val,
            };
          }
        }
      }

      return properties;
    };
    for (const route of routes) {
      let routePath = v1Base + "";
      if (route.parameters?.length) {
        let nRoute = route.route + "";
        route.parameters.forEach((x) => {
          if (x.in == "path") {
            nRoute = nRoute.replace(x.name.toString(), `{${x.name.toString().replace(":", "")}}`);
            x.name = x.name.toString().replace(":", "");
          }
        });
        routePath += nRoute;
      } else routePath += route.route;
      const methodObj: ISwaggerPath[""]["get"] = {
        description: route.description,
        operationId:
          route.method + "~" + routePath.split("/").join("~") ||
          (route.groupName || "") +
            ((route.handlerName as string) || Math.round(Math.random() * 100000)),
        security: [
          !route.noAuthenticate
            ? {
                // bearerAuth: [],
                [authKey]: [],
              }
            : null,
        ].filter((x) => x),
        requestBody: {
          required: true,
          content: {},
        },
        responses: {
          "200": {
            description: "Successful request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: dataToSchema(route.sampleResponseData),
                },
              },
            },
          },
        },
        tags: [route.groupName],
        parameters: route.parameters,
      };
      if (route.method == "get" || route.method == "delete") delete methodObj.requestBody;
      if (!paths[routePath]) paths[routePath] = {};
      if (methodObj.requestBody)
        if (route.requestContentType)
          methodObj.requestBody.content = {
            [route.requestContentType]: {
              schema: route.sampleRequestData
                ? {
                    type: "object",
                    properties: dataToSchema(route.sampleRequestData),
                  }
                : route.requestSchema,
            },
          };
        else
          methodObj.requestBody.content = {
            "application/json": {
              schema: {
                type: "object",
                properties: dataToSchema(route.sampleRequestData),
              },
            },
          };
      paths[routePath][route.method] = methodObj;
    }
    // console.log(paths)
    return paths;
  }

  export interface IRoute<TController = any> {
    requestSchema?: ISwaggerSchema;
    parameters?: ISwaggerParameter[];
    groupName?: string;
    description?: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    route: string;
    handler?: TController[keyof TController];
    // controller?: TController;
    handlerName?: keyof TController;
    sampleResponseData?: any;
    sampleRequestData?: any;
    internal?: boolean;
    noAuthenticate?: boolean;
    requestContentType?: keyof IContentType;
    middleWares?: any[];
  }
  export type IController = (
    req: Request,
    res: Response,
    next: Function
  ) => Promise<IResponse<any>>;
  export interface IResponse<TData> {
    data?: TData;
    statusCode: number;
    message?: string;
  }
}
