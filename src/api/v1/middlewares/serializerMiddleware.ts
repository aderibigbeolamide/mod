import { instanceToPlain } from "class-transformer";
import { Response, Request, NextFunction } from "express";

export function serializerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const oldJson = res.json;
  res.json = function (data) {
    return oldJson.call(this, instanceToPlain(data));
  };
  next();
}
