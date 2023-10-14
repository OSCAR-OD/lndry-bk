import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import subServiceService from "@services/sub-service-service";
import subService, {ISubService} from "@models/SubService";
import {paginate} from "@util/paginate";
import redisClient from "@shared/redis";
import serviceService from "@services/service-service";
import {clearCaches} from "@util/redis";
class SubServiceController {
  async add(req: Request, res: Response) {
    try {
      const { parent, name } = req.body;
      let validation = new Validator(req.body, {
        parent: 'required',
        name: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      if(parent === 'Select Service'){
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: 'Parent Service required.', errors: 'Parent Service required.'}
          ));
      }
      const exist = await subService.findOne({name, parent});
      if(exist){
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: 'Sub Service already exist.', errors: 'Sub Service already exist.'}
          ));
      }
      const created = await subServiceService.addOne({parent, name});
      await clearCaches();
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, {...req.body}));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, {...req.body}));
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
      let data:any = await subServiceService.getAll();
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
      const { parent, name } = req.body;
      let validation = new Validator(req.body, {
        parent: 'required',
        name: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      let data:ISubService = {parent, name };
      const updated = await subServiceService.updateOne(req.params.id,data);
      await clearCaches();
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
      const deleted = await subServiceService.delete(req.params.id);
      await clearCaches();
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
      let data : ISubService | null = await subServiceService.getSingle(id);
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

  async byService(req: Request, res: Response) {
    try {
      let {id} = req.params;
      let data : ISubService[] | null = await subServiceService.getByService(id);
      if(!data) {
        return res
          .status(OK)
          .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
      }
      const {page, size}:any = req.query;
      let returnData : any = data;
      if(page && size){
        returnData = await paginate(page, size, data);
      }
      if(returnData) {
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, returnData));
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

export default new SubServiceController();