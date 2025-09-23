// import axios from "axios";
// import { VerifyIdentityDto } from "../dtos/verify.dto.js";
// import { UserEntity } from "../entities/user.entity.js";
// import { dataSource } from "../../../config/database.config.js";
// import { UserDetailsEntity } from "../entities/user-details.entity.js";

// const BASE_URL = process.env.YOUVERIFY_BASE_URL;
// const token = process.env.YOUVERIFY_APIKEY;

// const axiosInstance = axios.create({
//   baseURL: `${BASE_URL}/v2/api/identity/ng`,
//   headers: {
//     "Content-Type": "application/json",
//     token: token,
//   },
// });

// class VerifyService {
//   userRepo = dataSource.getRepository(UserEntity);
//   userDetailsRepo = dataSource.getRepository(UserDetailsEntity);

//   private async verifyIdentity(
//     endpoint: string,
//     payload: any,
//     expectedDOB: string,
//     userId: string
//   ): Promise<boolean> {
//     const response = await axiosInstance.post(endpoint, payload);
//     const actualDOB = response?.data?.data?.dateOfBirth;

//     if (!actualDOB || actualDOB !== expectedDOB) {
//       throw new Error("Verification failed: Date of birth mismatch or missing");
//     }

//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (!user?.detailsId) throw new Error("User details not found");

//     const details = await this.userDetailsRepo.findOne({ where: { id: user.detailsId } });
//     if (!details) throw new Error("UserDetails entity missing");

//     details.isVerified = true;
//     await this.userDetailsRepo.save(details);

//     return true;
//   }

//   public async isUserVerified(userId: string) {
//     const user = await this.userRepo.findOne({ where: { id: userId } });
//     if (!user?.detailsId) return false;

//     const details = await this.userDetailsRepo.findOne({ where: { id: user.detailsId } });

//     return !!(details && details.isVerified);
//   }

//   public async verify(dto: VerifyIdentityDto, userId: string): Promise<boolean> {
//     const payload: any = {
//       id: dto.id,
//       isSubjectConsent: dto.isSubjectConsent ?? true,
//       validations: {
//         data: {
//           dateOfBirth: dto.dateOfBirth,
//         },
//       },
//     };

//     const endpoint = `/${dto.verificationType}`;
//     const expectedDOB = dto.dateOfBirth;

//     const verified = await this.verifyIdentity(endpoint, payload, expectedDOB, userId);

//     if (verified) {
//       const user = await this.userRepo.findOne({ where: { id: userId } });
//       if (user?.detailsId) {
//         await this.userDetailsRepo.update(user.detailsId, { isVerified: true });
//       }
//     }

//     return verified;
//   }
// }

// export default VerifyService;

import axios from "axios";
import { VerifyIdentityDto } from "../dtos/verify.dto.js";
import { UserEntity } from "../entities/user.entity.js";
import { dataSource } from "../../../config/database.config.js";
import { UserDetailsEntity } from "../entities/user-details.entity.js";

const BASE_URL = process.env.YOUVERIFY_BASE_URL;
const token = process.env.YOUVERIFY_APIKEY;

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/v2/api/identity/ng`,
  headers: {
    "Content-Type": "application/json",
    token: token,
  },
});

class VerifyService {
  userRepo = dataSource.getRepository(UserEntity);
  userDetailsRepo = dataSource.getRepository(UserDetailsEntity);

  private async verifyIdentity(
    endpoint: string,
    payload: any,
    expectedDOB: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await axiosInstance.post(endpoint, payload);
      const actualDOB = response?.data?.data?.dateOfBirth;

      if (!actualDOB || actualDOB !== expectedDOB) {
        return false;
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user?.detailsId) return false;

      const details = await this.userDetailsRepo.findOne({ where: { id: user.detailsId } });
      if (!details) return false;

      details.isVerified = true;
      await this.userDetailsRepo.update(details.id, details);

      return true;
    } catch (error) {
      console.error("Verification error:", error);
      return false;
    }
  }

  public async isUserVerified(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.detailsId) return false;

    const details = await this.userDetailsRepo.findOne({ where: { id: user.detailsId } });
    return !!(details && details.isVerified);
  }

  public async verify(dto: VerifyIdentityDto, userId: string): Promise<boolean> {
    const payload: any = {
      id: dto.id,
      isSubjectConsent: dto.isSubjectConsent ?? true,
      validations: {
        data: {
          dateOfBirth: dto.dateOfBirth,
        },
      },
    };

    const endpoint = `/${dto.verificationType}`;
    const expectedDOB = dto.dateOfBirth;

    const verified = await this.verifyIdentity(endpoint, payload, expectedDOB, userId);

    if (verified) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user?.detailsId) {
        await this.userDetailsRepo.update(user.detailsId, { isVerified: true });
      }
    }

    return verified;
  }
}

export default VerifyService;
