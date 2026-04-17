import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ReviewsService } from "../services/reviews.service";
import { ExtendedRequest, getUserIdFromToken } from "../middlewares/backend.middleware";

export class ReviewsController {

  private reviewsService: ReviewsService = new ReviewsService();

  async CreateReview(Req: Request, Res: Response) {
    try {

      let result = await this.reviewsService.CreateReview(getUserIdFromToken(Req as ExtendedRequest), Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateReview(Req: Request, Res: Response) {
    try {

      let result = await this.reviewsService.UpdateReview(
        getUserIdFromToken(Req as ExtendedRequest),
        Req.params.ReviewId as string,
        Req.body,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteReview(Req: Request, Res: Response) {
    try {

      let result = await this.reviewsService.DeleteReview(
        Req.params.ReviewId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllReviews(Req: Request, Res: Response) {
    try {

      let result = await this.reviewsService.GetAllReviews();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetReviewsByUserId(Req: Request, Res: Response) {
    try {

      let result = await this.reviewsService.GetReviewsByUserId(getUserIdFromToken(Req as ExtendedRequest));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}