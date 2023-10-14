import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import serviceAreaService from "@services/service-area-service";
import {paginate} from "@util/paginate";
import {IServiceArea} from "@models/ServiceArea";
import * as console from "console";
class ServiceAreaController {
  async add(req: Request, res: Response) {
    try {
      const {location_name, state_postcode, city_postcode, address, published, drafted} = req.body;
      let validation = new Validator(req.body, {
        city_postcode: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      const created = await serviceAreaService.addOne({location_name, state_postcode, city_postcode, address, published, drafted});
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
          {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
    }
  }

  async get(req: Request, res: Response) {
    try {
      let data:any = await serviceAreaService.getAll();
      const {page, size}:any = req.query;
      if(page && size){
        data = await paginate(page, size, data);
      }
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, data));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
          {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const {location_name, state_postcode, city_postcode, address, published, drafted} = req.body;
      console.log(req.body)
      let validation = new Validator(req.body, {
        city_postcode: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      const updated = await serviceAreaService.updateOne(req.params.id, {location_name, state_postcode, city_postcode, address, published, drafted});
      if (updated)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
          {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
    }
  }

  async _delete(req: Request, res: Response) {
    try {
      const deleted = await serviceAreaService.delete(req.params.id);
      if (deleted)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,errors: {}}));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
          {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
    }
  }

  async single(req: Request, res: Response) {
    try {
      const {id} = req.params;
      let data : IServiceArea | null = await serviceAreaService.getSingle(id);
      if(!data) {
        return res
          .status(OK)
          .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
      }
      if(data) {
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, data));
      }
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
          {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
    }
  }
}

export default new ServiceAreaController();