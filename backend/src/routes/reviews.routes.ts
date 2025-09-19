import { Router } from "express";
import { ReviewsController } from "../controllers/reviews.controller";
import { verifyToken, verifyAdmin, verifyUser } from "../middlewares/backend.middleware";

export const ReviewsRouter = Router();

const reviewsController: ReviewsController = new ReviewsController();

ReviewsRouter.post(
  "/create-review",
  verifyToken,
  verifyUser,
  async (Req, Res) => await reviewsController.CreateReview(Req, Res)
);

ReviewsRouter.put(
  "/update-review/:ReviewId",
  verifyToken,
  verifyUser,
  async (Req, Res) => await reviewsController.UpdateReview(Req, Res)
);

ReviewsRouter.delete(
  "/delete-review/:ReviewId",
  verifyToken,
  verifyAdmin,
  async (Req, Res) => await reviewsController.DeleteReview(Req, Res)
);

ReviewsRouter.get(
  "/get-all-reviews",
  async (Req, Res) => await reviewsController.GetAllReviews(Req, Res)
);

ReviewsRouter.get(
  "/get-user-reviews",
  verifyToken,
  verifyUser,
  async (Req, Res) => await reviewsController.GetReviewsByUserId(Req, Res)
);
