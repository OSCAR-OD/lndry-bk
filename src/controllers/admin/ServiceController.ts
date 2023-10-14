import service, { IService } from "@models/Service";
import serviceService from "@services/service-service";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { paginate } from "@util/paginate";
import { clearCaches } from "@util/redis";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  OK,
  UNAUTHORIZED,
} = StatusCodes;
class ServiceController {
  async add(req: Request, res: Response) {
    try {
      const { name, metaTitle, metaDescription } = req.body;
      let validation = new Validator(req.body, {
        name: 'required',
        metaTitle: 'required',
        metaDescription: 'required',
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({
              message: ErrorMessage.HTTP_BAD_REQUEST,
              errors: validation.errors.errors,
            })
          );
      }
      const exist = await service.findOne({ name });
      if (exist) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({
              message: "Service already exist.",
              errors: "Service already exist.",
            })
          );
      }
      let icon = "";
      if (req.file) icon = `https://${req.get("host")}/${req.file.filename}`;
      else
        return res
          .status(BAD_REQUEST)
          .send(failure({message : BAD_REQUEST, errors : {msg: ErrorMessage.HTTP_BAD_REQUEST}}));
      const created = await serviceService.addOne({name, icon, metaTitle, metaDescription});
      await clearCaches();
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { icon, ...req.body }));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(
            success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, {
              icon,
              ...req.body,
            })
          );
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          failure({
            message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
            errors: err,
          })
        );
    }
  }

  async get(req: Request, res: Response) {
    try {
      let data: any = await serviceService.getAll();
      const { page, size }: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          failure({
            message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
            errors: err,
          })
        );
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const { name, seo, metaTitle, metaDescription} = req.body;
      let validation = new Validator(req.body, {
        name: 'required',
        metaTitle: 'required',
        metaDescription: 'required',
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({
              message: ErrorMessage.HTTP_BAD_REQUEST,
              errors: validation.errors.errors,
            })
          );
      }
      let data:IService = {name, metaTitle, metaDescription};
      if (req.file) {
        const file = `https://${req.get("host")}/${req.file.filename}`;
        data.icon = file;
      }
      const updated = await serviceService.updateOne(
        req.params.id,
        data,
        `https://${req.get("host")}`
      );
      await clearCaches();
      if (updated)
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          failure({
            message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
            errors: err,
          })
        );
    }
  }

  async _delete(req: Request, res: Response) {
    try {
      const deleted = await serviceService.delete(
        req.params.id,
        `https://${req.get("host")}`
      );
      await clearCaches();
      if (deleted)
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(
            failure({
              message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,
              errors: {},
            })
          );
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          failure({
            message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
            errors: err,
          })
        );
    }
  }

  async single(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let data: IService | null = await serviceService.getSingle(id);
      if (!data) {
        return res
          .status(OK)
          .send(failure({ message: ErrorMessage.HTTP_NO_CONTENT, errors: {} }));
      }
      if (data) {
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
      }
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(
          failure({
            message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
            errors: err,
          })
        );
    }
  }
}

export default new ServiceController();
