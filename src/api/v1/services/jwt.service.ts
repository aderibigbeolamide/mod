import { User } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";

class JWTService {
  public createToken(user: User): string {
    const dataStoredInToken: any = { id: user.id };
    const secretKey: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 24 * 14; // 1 hour

    return jwt.sign(dataStoredInToken, secretKey, { expiresIn });
  }

  public decodeToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default JWTService;
