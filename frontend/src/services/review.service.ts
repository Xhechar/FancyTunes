import axios from "axios";
import { BackendRoute } from "../shared/shared.data";
import { ServiceResult } from "../shared/service.result/service.result";
import { Review } from "../interfaces/interfaces";
import {
  CreateReviewDto,
  UpdateReviewDto,
} from "../interfaces/dtos/interfaces.dtos";

export class ReviewsService {
  private static ApiUrl = `${BackendRoute}reviews`;

  static async CreateReview(
    Review: CreateReviewDto
  ): Promise<ServiceResult<Review>> {
    const result = await axios.post(`${this.ApiUrl}/create-review`, Review, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Review>;
  }

  static async UpdateReview(
    ReviewId: string,
    Review: UpdateReviewDto
  ): Promise<ServiceResult<Review>> {
    const result = await axios.put(
      `${this.ApiUrl}/update-review/${ReviewId}`,
      Review,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Review>;
  }

  static async DeleteReview(ReviewId: string): Promise<ServiceResult<Review>> {
    const result = await axios.delete(
      `${this.ApiUrl}/delete-review/${ReviewId}`,
      { withCredentials: true }
    );
    return result.data as ServiceResult<Review>;
  }

  static async GetAllReviews(): Promise<ServiceResult<Review>> {
    const result = await axios.get(`${this.ApiUrl}/get-all-reviews`);
    return result.data as ServiceResult<Review>;
  }

  static async GetUserReviews(): Promise<ServiceResult<Review>> {
    const result = await axios.get(`${this.ApiUrl}/get-user-reviews`, {
      withCredentials: true,
    });
    return result.data as ServiceResult<Review>;
  }
}
