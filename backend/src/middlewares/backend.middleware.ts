import { Request, Response, NextFunction } from "express";
import { TokenDetails } from "../interfaces/utils/token.details";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import jwt from "jsonwebtoken";

export interface ExtendedRequest extends Request {
  tokenDetails?: TokenDetails;
}

export const verifyToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.auth_token;

    if (!token) {
      return res
        .status(401)
        .json(
          ServiceResponse.failure(
            "Authentication token is missing",
            ErrorCode.UNAUTHORISED
          )
        );
    }

    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .json(
                ServiceResponse.failure(
                  "Authentication token has expired",
                  ErrorCode.UNAUTHORISED
                )
              );
          } else if (err.name === "JsonWebTokenError") {
            return res
              .status(401)
              .json(
                ServiceResponse.failure(
                  "Invalid authentication token",
                  ErrorCode.UNAUTHORISED
                )
              );
          } else {
            return res
              .status(500)
              .json(
                ServiceResponse.failure(
                  "Failed to verify authentication token",
                  ErrorCode.SERVER
                )
              );
          }
        }

        req.tokenDetails = decoded as TokenDetails;
        next();
      }
    );
  } catch (error) {
    return ServiceResponse.failure(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during authentication",
      ErrorCode.SERVER
    );
  }
};

export const getUserIdFromToken = (req: ExtendedRequest): string => {
  let data: TokenDetails = req.tokenDetails as TokenDetails;

  if (!data) return "";

  return data.UserId || "";
};

export const verifyAdmin = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  let data: TokenDetails = req.tokenDetails as TokenDetails;

  if (!data)
    return res
      .status(401)
      .json(
        ServiceResponse.failure(
          "Authentication token is missing",
          ErrorCode.UNAUTHORISED
        )
      );

  if (data.Role !== "admin") {
    return res
      .status(403)
      .json(
        ServiceResponse.failure(
          "Access denied. Admins only.",
          ErrorCode.UNAUTHORISED
        )
      );
  }

  next();
};

export const verifyUser = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  let data: TokenDetails = req.tokenDetails as TokenDetails;

  if (!data)
    return res
      .status(401)
      .json(
        ServiceResponse.failure(
          "Authentication token is missing",
          ErrorCode.UNAUTHORISED
        )
      );

  if (data.Role !== "user") {
    return res
      .status(403)
      .json(
        ServiceResponse.failure(
          "Access denied. Users only.",
          ErrorCode.UNAUTHORISED
        )
      );
  }

  next();
};
