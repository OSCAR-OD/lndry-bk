import { IBanner } from "@models/Banner";
import bannerService from "@services/banner-service";
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

class BannerController {
  async add(req: Request, res: Response) {
    try {
      const { name, position, caption, link, color } = req.body;
      let validation = new Validator(req.body, {
        name: "required",
        position: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      if (!req.file) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: BAD_REQUEST,
            errors: { msg: ErrorMessage.HTTP_BAD_REQUEST },
          })
        );
      }
      // const file= `https://${req.get('host')}/${req.file.filename}`;
      const file = `https://${req.get("host")}/${req.file.filename}`;
      const created = await bannerService.addOne({
        name,
        position,
        file,
        link,
        caption,
        color
      });
      await clearCaches();
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { file, ...req.body }));
      else
        return res.status(UNPROCESSABLE_ENTITY).send(
          success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, {
            file,
            ...req.body,
          })
        );
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async get(req: Request, res: Response) {
    try {
      let data: any = await bannerService.getAll();
      const { page, size }: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const { name, position, caption, link, color } = req.body;
      let validation = new Validator(req.body, {
        name: "required",
        position: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      let data: IBanner = { name, position, caption, link, file: "", color };
      if (req.file) {
        const file = `https://${req.get("host")}/${req.file.filename}`;
        data.file = file;
      }
      const updated = await bannerService.updateOne(
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
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async _delete(req: Request, res: Response) {
    try {
      const deleted = await bannerService.delete(
        req.params.id,
        `https://${req.get("host")}`
      );
      await clearCaches();
      if (deleted)
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res.status(UNPROCESSABLE_ENTITY).send(
          failure({
            message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,
            errors: {},
          })
        );
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
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
      let data: IBanner | null = await bannerService.getSingle(id);
      if (!data) {
        return res
          .status(OK)
          .send(failure({ message: ErrorMessage.HTTP_NO_CONTENT, errors: {} }));
      }
      if (data) {
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
      }
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }
}

export default new BannerController();
