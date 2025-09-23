export interface ISwaggerPath {
  [pathName: string]: {
    [method in EMethods]?: Method;
  };
}
enum EMethods {
  post = 'post',
  get = 'get',
  put = 'put',
  patch = 'patch',
  parameters = 'parameters',
}

interface Method {
  description: string;
  operationId: string;
  parameters?: ISwaggerParameter[];
  requestBody: RequestBody;
  responses: Responses;
  security: Security[];
  tags: string[];
}
export interface ISwaggerParameter<TParamEntity = any> {
  name: keyof TParamEntity;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  type?: 'integer' | 'array' | 'string';
}
interface Responses {
  [x: string]: ResponseObj;
}

interface ResponseObj {
  description: string;
  content: IContentType;
}

export interface IContentType {
  'application/json'?: Applicationjson;
  'multipart/form-data'?: Applicationjson;
}

interface Applicationjson {
  schema: ISwaggerSchema;
  example?: any;
}

export interface ISwaggerSchema {
  $ref?: string;
  type?: 'object';
  required?: string[];
  properties?: {
    [x: string]: {
      format?: 'int32' | 'int64' | 'float' | 'double' | 'password' | 'binary';
      type: 'integer' | 'number' | 'number' | 'string'|'array';
      example?: any;
      description?: string;
    };
  };
}

interface RequestBody {
  content: IContentType;
  required: boolean;
}

interface Security {
  bearerAuth?: any[];
  api_key?: string[];
}
