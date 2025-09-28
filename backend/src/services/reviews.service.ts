import { IReviewsService } from "../interfaces/abstracts/services.abstracts";
import { PrismaClient, Review } from "@prisma/client";
import { CreateReviewDto, UpdateReviewDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResult } from "../interfaces/service.result/service.result";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { CreateReviewSchema, UpdateReviewSchema } from "../validators/payload.validators";
import { v4 } from "uuid";
import { io } from "../server";

export class ReviewsService implements IReviewsService {

  private prisma = new PrismaClient({
    log: ["error"]
  });

  async CreateReview(UserId: string, Review: CreateReviewDto): Promise<ServiceResult<Review>> {

    let { error } = CreateReviewSchema.validate(Review);

    if(error) return ServiceResponse.failure<Review>(ErrorCode.VALIDATION, error.details[0].message);
 
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if(UserExists == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let CreateReview = await this.prisma.review.create({
      data: {
        ReviewId: v4(),
        UserId,
        ...Review
      }
    });

    if (!CreateReview) return ServiceResponse.failure<Review>(ErrorCode.SERVER, "unable to create review at the moment");

    io.emit("review-created", CreateReview);

    return ServiceResponse.success<Review>("review created successfully");
  }
  async UpdateReview(UserId: string, ReviewId: string, Review: UpdateReviewDto): Promise<ServiceResult<Review>> {
    
    let { error } = UpdateReviewSchema.validate(Review);

    if(error) return ServiceResponse.failure<Review>(ErrorCode.VALIDATION, error.details[0].message);
 
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if(UserExists == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let ReviewExists = await this.prisma.review.findUnique({
      where: {
        ReviewId,
        UserId
      }
    });

    if(ReviewExists == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "the specified review does not exist.");

    let UpdateReview = await this.prisma.review.update({
      where: {
        ReviewId
      },
      data: {
        ...Review
      }
    });

    if (!UpdateReview) return ServiceResponse.failure<Review>(ErrorCode.SERVER, "unable to update review at the moment");

    io.emit("review-updated", UpdateReview);

    return ServiceResponse.success<Review>("review updated successfully");
  }
  async DeleteReview(ReviewId: string): Promise<ServiceResult<Review>> {
    
    let ReviewExists = await this.prisma.review.findUnique({
      where: {
        ReviewId
      }
    });

    if(ReviewExists == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "the specified review does not exist.");

    let DeleteReview = await this.prisma.review.delete({
      where: {
        ReviewId
      }
    });

    if (!DeleteReview) return ServiceResponse.failure<Review>(ErrorCode.SERVER, "unable to delete review at the moment");

    io.emit("review-deleted", DeleteReview);

    return ServiceResponse.success<Review>("review deleted successfully");
  }
  async GetAllReviews(): Promise<ServiceResult<Review>> {
    
    let Reviews = await this.prisma.review.findMany({
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        Room: true,
        Delicacy: true,
        BusinessRoom: true
      }
    });

    if (Reviews == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "no reviews available at the moment.");

    return ServiceResponse.success<Review>("reviews fetched successfully", undefined, Reviews);
  }
  async GetReviewsByUserId(UserId: string): Promise<ServiceResult<Review>> {
    
    let UserExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if(UserExists == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "your details are unavailable at the moment.");

    let Reviews = await this.prisma.review.findMany({
      where: {
        UserId
      },
      orderBy: {
        CreatedAt: "desc"
      },
      include: {
        User: true,
        Room: true,
        Delicacy: true,
        BusinessRoom: true
      }
    });

    if (Reviews == null) return ServiceResponse.failure<Review>(ErrorCode.NOTFOUND, "no reviews available at the moment.");

    return ServiceResponse.success<Review>("reviews fetched successfully", undefined, Reviews);
  }
}