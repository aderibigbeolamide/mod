// import { StatusCodes } from 'http-status-codes';
// import fetch, { BodyInit, RequestInit } from 'node-fetch';
// import { BadRequestError } from '../../../utils/ApiError.js';

// class PaystackBaseApi {
//   public baseUrl: string;

//   constructor(url: string) {
//     this.baseUrl = url;
//   }

//   private async fetch<T>(
//     url: string,
//     body?: BodyInit,
//     args?: Record<string, string>,
//     requestInit?: RequestInit
//   ): Promise<T> {
//     try {
//       const urlObj = new URL(url, this.baseUrl);

//       if (args) {
//         urlObj.search = new URLSearchParams(args).toString();
//       }

//       const requestOptions: RequestInit = {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           ...requestInit?.headers,
//         },
//         ...requestInit,
//         body,
//       };

//       const response = await fetch(urlObj.toString(), requestOptions);

//       if (!response.ok) {
//         const errorMessage = await response.text();
//         throw new BadRequestError(errorMessage || 'Failed to fetch data');
//       }

//       if (response.status === StatusCodes.NO_CONTENT) {
//         return undefined as T;
//       }

//       return response.json() as Promise<T>;
//     } catch (error: any) {
//       throw new BadRequestError(error.message);
//     }
//   }

//   public get<T>(
//     endpoint: string,
//     args?: Record<string, string>,
//     requestInit?: RequestInit
//   ): Promise<T> {
//     return this.fetch<T>(endpoint, undefined, args, {
//       ...requestInit,
//       method: 'GET',
//     });
//   }

//   public post<T>(
//     endpoint: string,
//     body?: Record<string, any>,
//     args?: Record<string, string>,
//     requestInit?: RequestInit
//   ): Promise<T> {
//     return this.fetch<T>(
//       endpoint,
//       body ? JSON.stringify(body) : undefined,
//       args,
//       {
//         ...requestInit,
//         method: 'POST',
//       }
//     );
//   }
// }

// export default PaystackBaseApi;

import { StatusCodes } from 'http-status-codes';
import fetch, { BodyInit, RequestInit } from 'node-fetch';
import { BadRequestError } from '../../../utils/ApiError.js';

class PaystackBaseApi {
  public baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  private async fetch<T>(
    url: string,
    body?: BodyInit,
    args?: Record<string, string>,
    requestInit?: RequestInit
  ): Promise<T> {
    try {
      const urlObj = new URL(url, this.baseUrl);
      if (args) {
        urlObj.search = new URLSearchParams(args).toString();
      }

      const requestOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...requestInit?.headers,
        },
        ...requestInit,
        body,
      };

      const response = await fetch(urlObj.toString(), requestOptions);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new BadRequestError(errorMessage || 'Failed to fetch data');
      }

      if (response.status === StatusCodes.NO_CONTENT) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  public get<T>(
    endpoint: string,
    args?: Record<string, string>,
    requestInit?: RequestInit
  ): Promise<T> {
    return this.fetch<T>(endpoint, undefined, args, {
      ...requestInit,
      method: 'GET',
    });
  }

  public post<T>(
    endpoint: string,
    body?: Record<string, any>,
    args?: Record<string, string>,
    requestInit?: RequestInit
  ): Promise<T> {
    return this.fetch<T>(
      endpoint,
      body ? JSON.stringify(body) : undefined,
      args,
      {
        ...requestInit,
        method: 'POST',
      }
    );
  }
}

export default PaystackBaseApi;
