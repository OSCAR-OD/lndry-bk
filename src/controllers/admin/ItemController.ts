import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';

const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import itemService from "@services/item-service";
import {IItem} from "@models/Item";
import {paginate} from "@util/paginate";
import {clearCaches} from "@util/redis";

class ServiceController {
  async add(req: Request, res: Response) {
    try {
      const {
        name,
        service,
        subTitle,
        price,
        description,
        offerAmount,
        metaTitle,
        metaDescription,
        offerType,
        showOnPopularSection,
        keywords
      } = req.body;
      let validation = new Validator(req.body, {
        name: 'required', service: 'required', price: 'required', description: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure({message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}));
      }
      if (!req.file) {
        return res
          .status(BAD_REQUEST)
          .send(failure({message: BAD_REQUEST, errors: {msg: ErrorMessage.HTTP_BAD_REQUEST}}));
      }
      let image = '';
      if (req.file) image = `https://${req.get('host')}/${req.file.filename}`;
      const data : any = {
        name,
        service,
        subTitle,
        price,
        image,
        description,
        offerAmount,
        offerType,
        metaTitle,
        metaDescription,
        keywords,
        showOnPopularSection: showOnPopularSection === null || showOnPopularSection === undefined || showOnPopularSection === 'false'? false : true
      }
      if(req.body.sub_service){
        data.sub_service = req.body.sub_service
      }
      const created = await itemService.addOne(data);
      await clearCaches();
      if (created) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, {image, ...req.body})); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, {image, ...req.body}));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async get(req: Request, res: Response) {
    try {
      let data: any = await itemService.getAll();
      const {page, size}: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, data));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const {
        name,
        service,
        price,
        subTitle,
        description,
        metaTitle,
        metaDescription,
        offerAmount,
        offerType,
        showOnPopularSection,
        keywords
      } = req.body;
      let validation = new Validator(req.body, {
        name: 'required', service: 'required', price: 'required', description: 'required'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure({message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}));
      }
      let image = '';
      if (req.file) image = `https://${req.get('host')}/${req.file.filename}`;
      let data: IItem = {
        name,
        service,
        subTitle,
        price,
        image,
        description,
        offerAmount,
        offerType,
        metaTitle,
        metaDescription,
        keywords,
        showOnPopularSection: showOnPopularSection === null || showOnPopularSection === undefined || showOnPopularSection === 'false'? false : true
      };
      if(req.body.sub_service){
        data.sub_service = req.body.sub_service;
      }
      const updated = await itemService.updateOne(req.params.id, data, `https://${req.get('host')}`);
      await clearCaches();
      if (updated) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, req.body)); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  
  async _delete(req: Request, res: Response) {
    try {
      const deleted = await itemService.delete(req.params.id, `https://${req.get('host')}`);
      await clearCaches();
      if (deleted) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, req.body)); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, errors: {}}));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async single(req: Request, res: Response) {
    try {
      const {id} = req.params;
      let data: IItem | null = await itemService.getSingle(id);
      if (!data) {
        return res
          .status(OK)
          .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
      }
      if (data) {
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, data));
      }
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }
}

export default new ServiceController();