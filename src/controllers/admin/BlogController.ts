import { IBlog } from "@models/Blog";
import blogService from "@services/blog-service";
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
class BlogController {
  async add(req: Request, res: Response) {
    try {
      const {
        title,
        keywords,
        description,
        metaTitle,
        metaDescription,
        order,
        published,
        drafted,
      } = req.body;

      let validation = new Validator(req.body, {
        title: "required",
        keywords: "required|array",
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
      }else {
        let existingBlog: any  = await blogService.getAll();
        let duplicateBlog: any  = existingBlog.find((blog: any) => blog.order == order);
          
       if (duplicateBlog) {
         duplicateBlog.order = null;
         await blogService.updateOne(duplicateBlog._id, duplicateBlog, `https://${req.get("host")}`);       
     }
     
     let image = "";
      if (req.file) image = `https://${req.get("host")}/${req.file.filename}`;
      const created = await blogService.addOne({
        title,
        metaTitle,
        metaDescription,
        keywords,
        order,
        description,
        published,
        drafted,
        image,
      });
      await clearCaches();
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

  async get(req: Request, res: Response) {
    try {
      let data: any = await blogService.getAll();
      //console.log("data", data);
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
      const {
        title,
        metaTitle,
        metaDescription,
        keywords,
        order,
        description,
        published,
        drafted,
      } = req.body;
      let validation = new Validator(req.body, {
        title: "required",
        keywords: "required|array",
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
      let data: IBlog = {
        title,
        metaTitle,
        metaDescription,
        keywords,
        order,
        description,
        published,
        drafted,
      };
      if (req.file) {
        const file = `https://${req.get("host")}/${req.file.filename}`;
        data.image = file;
      }
      const updated = await blogService.updateOne(
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
      const deleted = await blogService.delete(
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
      let data: IBlog | null = await blogService.getSingle(id);
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

export default new BlogController();