import { ReviewTypes } from "../enums/review.types.enum.js";

export interface Review {
  id: string;
  userId: string;
  type: ReviewTypes;
  comment: string;
  rating: number;
  landlordId: string;
}
