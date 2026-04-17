import { Request, Response } from "express";
import { CreateAccommodationDto, UpdateAccommodationDto } from "../interfaces/dtos/interfaces.dtos";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { AccommodationsService } from "../services/accommodations.service";
import { ExtendedRequest, getUserIdFromToken } from "../middlewares/backend.middleware";

export class AccommodationController {

  private accommodationService: AccommodationsService = new AccommodationsService();

  async UpdateAccommodation(Req: Request, Res: Response) {
    try {

      let result = await this.accommodationService.UpdateAccommodation(getUserIdFromToken(Req), Req.params.AccommodationId as string, Req.body as UpdateAccommodationDto);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteAccommodation(Req: Request, Res: Response) {
    try {

      let result = await this.accommodationService.DeleteAccommodation(Req.params.AccommodationId as string);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllAccommodations(Req: Request, Res: Response) {
    try {

      let result = await this.accommodationService.GetAllAccommodations();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetUserAccommodations(Req: Request, Res: Response) {
    try {

      let result = await this.accommodationService.GetUserAccommodations(getUserIdFromToken(Req as ExtendedRequest));

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}