import { dataSource } from "../../../config/database.config.js";
import { CreateTourRequestDto } from "../dtos/tour-request.dto.js";
import { TourRequestEntity } from "../entities/tour-request.entity.js";

export default class TourRequestService {
  static repo = dataSource.getRepository(TourRequestEntity);

  public static async CreateTourRequest(dto: CreateTourRequestDto) {
    const newRequest = new TourRequestEntity();
    newRequest.meetDate = dto.meetDate;
    newRequest.email = dto.email;
    newRequest.phone = dto.phone;
    newRequest.preferVirtualTour = dto.preferVirtualTour;

    return await this.repo.save(newRequest);
  }

  public static async GetById(tourRequestID: string) {
    return await this.repo.findOne({
      where: {
        id: tourRequestID,
      },
    });
  }

  public static async GetAll() {
    return await this.repo.find();
  }

  /**
   * Check if a user has already requested a tour based on email or phone.
   * @param email - The user's email.
   * @param phone - The user's phone number.
   * @returns A boolean indicating if the user has requested a tour.
   */
  public static async HasUserRequestedTour(email: string, phone: string): Promise<boolean> {
    const existingRequest = await this.repo.findOne({
      where: [
        { email: email }, // Check if the email matches
        { phone: phone }, // Check if the phone matches
      ],
    });

    return !!existingRequest; // Return true if a request exists, false otherwise
  }
}
