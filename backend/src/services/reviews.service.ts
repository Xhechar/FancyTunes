import { IReviewsService } from "../interfaces/abstracts/services.abstracts";
import { PrismaClient, Review } from "@prisma/client";
import { CreateReviewDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";

export class ReviewsService implements IReviewsService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateReview(Review: CreateReviewDto): Promise<ServiceResult<Review>> {
    throw new Error("Method not implemented.");
  }
  async UpdateReview(ReviewId: string, Review: CreateReviewDto): Promise<ServiceResult<Review>> {
    throw new Error("Method not implemented.");
  }
  async DeleteReview(ReviewId: string): Promise<ServiceResult<Review>> {
    throw new Error("Method not implemented.");
  }
  async GetAllReviews(): Promise<ServiceResult<Review>> {
    throw new Error("Method not implemented.");
  }
  async GetReviewsByUserId(UserId: string): Promise<ServiceResult<Review>> {
    throw new Error("Method not implemented.");
  }
}