import { NextFunction, Request, Response } from "express";
import JWTService from "../services/jwt.service.js";
import { dataSource } from "../../../config/database.config.js";
import { UserEntity } from "../entities/user.entity.js";
import { ERROR_CODE_AUTH_001, STATUS_FAIL } from "../../../config/constants.js";
import { HttpException } from "../exceptions/http.exception.js";
import { logger } from "../../../config/logger.js";
import Utility from "../../../utils/utility.js";
import { User } from "../interfaces/user.interface.js";
import { UserRoles } from "../enums/user.roles.enum.js";
import { UserDetailsEntity } from "../entities/user-details.entity.js";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authString: string = req.header("Authorization");
    let user = await getUser(authString, UserRoles.LESSOR_RENTER);
    if (!user) {
      Utility.sendResponse(res, {
        code: 400,
        status: STATUS_FAIL,
        message: "Invalid token",
      });
      return;
    }
    req.sender = user;
    next();
  } catch (error) {
    logger.error("Error authenticating user token");
    Utility.logError(error);
    Utility.sendResponse(res, {
      code: 401,
      status: STATUS_FAIL,
      message: "Invalid token",
      data: { error },
    });
  }
};

// export const ensureVerified = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.sender.id; // Assuming the user is already authenticated and stored in `req.sender`

//     // Fetch user from the database
//     const user = await dataSource.getRepository(UserDetailsEntity).findOne({ where: { id: userId } });

//     // Check if user exists and is verified
//     if (!user || !user.isVerified) {
//       Utility.sendResponse(res, {
//         code: 403,
//         status: STATUS_FAIL,
//         message: 'You must verify your account to proceed.',
//       });
//       return;
//     }

//     // Proceed to the next middleware or controller
//     next();
//   } catch (error) {
//     logger.error('Error checking user verification status');
//     Utility.logError(error);
//     Utility.sendResponse(res, {
//       code: 500,
//       status: STATUS_FAIL,
//       message: 'An error occurred while verifying the account status.',
//       data: { error },
//     });
//   }
// };

export const authenticateLessor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authString: string = req.header("Authorization");
    let user = await getUser(authString, UserRoles.LESSOR);
    if (!user) {
      Utility.sendResponse(res, {
        code: 400,
        status: STATUS_FAIL,
        message: "Invalid token",
      });
      return;
    }

    if (user.role != UserRoles.LESSOR && user.role != UserRoles.LESSOR_RENTER) {
      Utility.sendResponse(res, {
        code: 400,
        status: STATUS_FAIL,
        message: "User is not a Lessor",
      });
      return;
    }
    req.sender = user;
    next();
  } catch (error) {
    logger.error("Error authenticating user token");
    Utility.logError(error);
    Utility.sendResponse(res, {
      code: 401,
      status: STATUS_FAIL,
      message: "Invalid token",
      data: { error },
    });
  }
};

export const authenticateRenter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let authString: string = req.header("Authorization");
    let user = await getUser(authString, UserRoles.RENTER);
    if (!user) {
      Utility.sendResponse(res, {
        code: 400,
        status: STATUS_FAIL,
        message: "Invalid token",
      });
      return;
    }

    if (user.role != UserRoles.RENTER && user.role != UserRoles.LESSOR_RENTER) {
      Utility.sendResponse(res, {
        code: 400,
        status: STATUS_FAIL,
        message: "User is not a Renter",
      });
      return;
    }
    req.sender = user;
    next();
  } catch (error) {
    logger.error("Error authenticating user token");
    Utility.logError(error);
    Utility.sendResponse(res, {
      code: 401,
      status: STATUS_FAIL,
      message: "Invalid token",
      data: { error },
    });
  }
};

const getUser = async (authString: string, userRole: UserRoles): Promise<User> => {
  let env = process.env.NODE_ENV;
  let user: User;
  if (!authString && env.toLocaleLowerCase() < "staging") {
    // Use test userOne as default lessor
    if (userRole == UserRoles.LESSOR_RENTER || userRole == UserRoles.LESSOR) {
      user = await dataSource
        .getRepository(UserEntity)
        .findOne({ where: { email: "user.one@zdmail.com" } });
    } else if (userRole == UserRoles.RENTER) {
      user = await dataSource
        .getRepository(UserEntity)
        .findOne({ where: { email: "test14@letbud.ng" } });
    }
  } else {
    let token = authString.slice(7);
    let decoded = new JWTService().decodeToken(token);
    user = await dataSource.getRepository(UserEntity).findOne({ where: { id: decoded?.id } });
  }
  return user;
};
