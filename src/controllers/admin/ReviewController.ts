import Review, { IReview } from "@models/Review";
import reviewService from "@services/review-service";
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
      const { item, customer, customerName, description, rating } = req.body;
      let validation = new Validator(req.body, {
        item: "required",
        description: "required",
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
      let image = "";
      const reqFiles: any = req.files;
      if (reqFiles.file)
        image = `https://${req.get("host")}/${reqFiles.file[0].filename}`;
      let images = [];
      if (reqFiles.images) {
        const files = reqFiles.images;
        for (let i = 0; i < files.length; i++) {
          images.push(`https://${req.get("host")}/${files[i].filename}`);
        }
      }
      const created = await reviewService.addOne({
        item,
        customer,
        customerName,
        image,
        description,
        rating,
        images,
      });
      await clearCaches();
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { image, images, ...req.body }));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(
            success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, {
              image,
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
      let data: any = await reviewService.getAll();
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
      const { item, customer, customerName, description, rating } = req.body;
      let validation = new Validator(req.body, {
        item: "required",
        description: "required",
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
      let image = "";
      const reqFiles: any = req.files;
      if (reqFiles.file)
        image = `https://${req.get("host")}/${reqFiles.file[0].filename}`;
      let images = [];
      if (reqFiles.images) {
        const files = reqFiles.images;
        for (let i = 0; i < files.length; i++) {
          images.push(`https://${req.get("host")}/${files[i].filename}`);
        }
      }
      let data: IReview = {
        item,
        customer,
        customerName,
        description,
        image,
        rating,
        images,
      };
      const updated = await reviewService.updateOne(
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
      const deleted = await reviewService.delete(
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
      let data: IReview | null = await reviewService.getSingle(id);
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

  async changeStatus(req: Request, res: Response) {
    try {
      const { approval } = req.body;
      let validation = new Validator(req.body, {
        approval: "required",
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
      const updated = await Review.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { approval: approval } },
        {
          new: true,
        }
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
}

export default new ServiceController();
