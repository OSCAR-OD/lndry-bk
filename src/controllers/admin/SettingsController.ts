import { ISettings } from "@models/Settings";
import settingsService from "@services/settings-service";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
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

class SettingsController {
  async get(req: Request, res: Response) {
    try {
      let data: ISettings | null = await settingsService.getAll();
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
      phoneNumber,
      email,
      address,
      copyright,
      facebook,
      twitter,
      whatsapp,
      instagram,
      youtube,
      linkedin,
      about,
      referrerGet,
      customerGet
    } = req.body;
    let validation = new Validator(req.body, {
      email: "email",
      address: "min:10",
      copyright: "min: 20",
      facebook: "url",
      twitter: "url",
      whatsapp: "url",
      instagram: "url",
      youtube: "url",
      linkedin: "url",
      about: "min:20"
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
    let logo = "";
    if (req.file) logo = `https://${req.get("host")}/${req.file.filename}`;
    let data: ISettings = {
      phoneNumber,
      email,
      address,
      copyright,
      facebook,
      twitter,
      whatsapp,
      instagram,
      youtube,
      linkedin,
      about,
      logo,
      referrerGet,
      customerGet
    };
    console.log(data);
    const updated = await settingsService.updateOne(
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
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }
}

export default new SettingsController();
