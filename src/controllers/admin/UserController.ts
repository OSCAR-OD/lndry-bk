import { IUser } from "@models/User";
import userService from "@services/user-service";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { paginate } from "@util/paginate";
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
class UserController {
  async add(req: Request, res: Response) {
    try {
      const { name, email, phone, role, freelanceShare, freelancerMaxGetPerOrder } = req.body;
      let password = req.body.password;
      if (password === null || password === "") {
        password = "12345678";
      }
      let validation = new Validator(req.body, {
        name: "required",
        email: "required|email",
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
      if (req.file) image = `https://${req.get("host")}/${req.file.filename}`;
      const created = await userService.addOne({
        name,
        email,
        phone,
        role,
        image,
        password,
        freelanceShare,
        freelancerMaxGetPerOrder
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
      let data: any;
      if (req.originalUrl.indexOf("customers") > -1) {
        data = await userService.getAll("User");
      } else {
        let start: any = req.query.start ?? "";
        let end: any = req.query.end ?? "";
        data = await userService.getAll("", start, end);
      }

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
      const { name, phone, role, freelanceShare, freelancerMaxGetPerOrder } = req.body;
      let password = req.body.password;
      let validation = new Validator(req.body, {
        name: "required",
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
      let data: any = { name, phone, role, password, freelanceShare, freelancerMaxGetPerOrder };
      if (req.file) {
        const file = `https://${req.get("host")}/${req.file.filename}`;
        data.image = file;
      }
      const user = await userService.getSingle(req.params.id);
      if (!user) {
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
      }
      const updated = await userService.updateOne(
        user.email,
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
      const deleted = await userService.deleteByID(
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
      let data: IUser | null = await userService.getSingle(id);
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

export default new UserController();
