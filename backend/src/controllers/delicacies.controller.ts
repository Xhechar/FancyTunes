import { Request, Response } from "express";
import { ErrorCode } from "../interfaces/enum/response.enum";
import { ServiceResponse } from "../interfaces/service.result/service.response";
import { DelicaciesService } from "../services/delicacies.service";

export class DelicacyController {

  private delicacyService: DelicaciesService = new DelicaciesService();

  async CreateDelicacy(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.CreateDelicacy(Req.body);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async UpdateDelicacy(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.UpdateDelicacy(
        Req.params.DelicacyId as string,
        Req.body,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async DeleteDelicacy(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.DeleteDelicacy(
        Req.params.DelicacyId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetDelicacyByDelicacyId(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.GetDelicacyByDelicacyId(
        Req.params.DelicacyId as string,
      );

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAllDelicacies(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.GetAllDelicacies();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetAvailableDelicacies(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.GetAvailableDelicacies();

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  async GetDelicaciesByCategory(Req: Request, Res: Response) {
    try {

      let result = await this.delicacyService.GetDelicaciesByCategory(Req.body.Category);

      return Res.status(200).json(result);
      
    } catch (error) {
      return Res.status(500).json(ServiceResponse.failure<object>(ErrorCode.SERVER, error instanceof Error ? error.message : "an internal server error occured."));
    }
  }
  
}