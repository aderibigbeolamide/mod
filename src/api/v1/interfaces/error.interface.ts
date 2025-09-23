import { EErrorCode } from "../enums/errors.enum.js";

export interface IErrorStructure {
  message?: string;
  errorCode?: EErrorCode; 
  statusNo?: number;
  errorObject?: {};
}
