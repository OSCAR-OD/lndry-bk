import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import videoService from "@services/video-service";
import {paginate} from "@util/paginate";
import {IVideo} from "@models/Video";
import {clearCaches} from "@util/redis";
class VideoController {
  async add(req: Request, res: Response) {
    try {
      const {title, link} = req.body;
      let validation = new Validator(req.body, {
        title: 'required',
        link: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      const created = await videoService.addOne({title, link});
      await clearCaches();
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
      let data:any = await videoService.getAll();
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
      const {title, link} = req.body;
      let validation = new Validator(req.body, {
        title: 'required',
        link: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      const updated = await videoService.updateOne(req.params.id, {title, link});
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
      const deleted = await videoService.delete(req.params.id);
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
      let data : IVideo | null = await videoService.getSingle(id);
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

export default new VideoController();