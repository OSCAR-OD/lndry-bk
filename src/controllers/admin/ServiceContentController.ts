import { IServiceContent } from "@models/ServiceContent";
import serviceContent from "@services/service-content-service";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import Functions from "@util/functions";
import { paginate } from "@util/paginate";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK } =
  StatusCodes;
class ServiceContentController {
  async add(req: Request, res: Response) {
    try {
      const { service, description, seo } = req.body;
      let validation = new Validator(req.body, {
        service: "required",
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
      for (let i = 0; i < seo.length; i++) {
        validation = new Validator(
          seo[i],
          {
            title: "required",
            description: "required",
          },
          {
            required: `For ${Functions.numberToText(
              i + 1
            )} SEO meta data both title and description are required`,
          }
        );
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
      }
      let image = "";
      if (req.file) image = `https://${req.get("host")}/${req.file.filename}`;
      const created = await serviceContent.addOne({
        service,
        image,
        description,
        seo,
      });
      if (created)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { image, ...req.body }));
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
      let data: any = await serviceContent.getAll();
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
      const { service, description, seo } = req.body;
      let validation = new Validator(req.body, {
        service: "required",
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
      for (let i = 0; i < seo.length; i++) {
        validation = new Validator(
          seo[i],
          {
            title: "required",
            description: "required",
          },
          {
            required: `For ${Functions.numberToText(
              i + 1
            )} SEO meta data both title and description are required`,
          }
        );
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
      }
      let data: IServiceContent = { service, description, seo };
      if (req.file) {
        const file = `https://${req.get("host")}/${req.file.filename}`;
        data.image = file;
      }
      const updated = await serviceContent.updateOne(
        req.params.id,
        data,
        `https://${req.get("host")}`
      );
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
      const deleted = await serviceContent.delete(
        req.params.id,
        `https://${req.get("host")}`
      );
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
      let data: IServiceContent | null = await serviceContent.getSingle(id);
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

export default new ServiceContentController();
