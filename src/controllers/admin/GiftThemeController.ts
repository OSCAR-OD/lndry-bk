import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { paginate } from "@util/paginate";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
import GiftThemeService from "@services/GiftThemeService";
import {IGiftTheme} from "@models/GiftTheme";
import path from "path";
import fs from "fs";
import envVars from "@shared/env-vars";
const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    OK,
    UNAUTHORIZED,
} = StatusCodes;
class GiftThemeController{
    async add(req: Request, res: Response){
        try {
            const {html} = req.body;
            let validation = new Validator(req.body, {
                html: 'required'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            if (!req.file) {
                return res.status(BAD_REQUEST).send(
                    failure({
                        message: BAD_REQUEST,
                        errors: { msg: ErrorMessage.HTTP_BAD_REQUEST },
                    })
                );
            }
            const file = `https://${req.get("host")}/${req.file.filename}`;
            let data = {html, previewImage: file};
            const created = await GiftThemeService.addAndReturn(data);
            if (created)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
            else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
        }  catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async getAll(req: Request, res: Response){
        try {
            let data : any = await GiftThemeService.all();
            const {page, size}:any = req.query;
            if(page && size){
                data = await paginate(page, size, data);
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, data));
        }  catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async single(req: Request, res: Response){
        try {
            const {id} = req.params;
            let data = await GiftThemeService.singleByField({_id: id});
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
        }  catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async edit(req: Request, res: Response){
        try {
            const {id} = req.params;
            let exist = await GiftThemeService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const {html} = req.body;
            let validation = new Validator(req.body, {
                html: 'required'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            const data : IGiftTheme = {html};
            if(req.file){
                data.previewImage = `https://${req.get("host")}/${req.file.filename}`;
                if(exist.previewImage){
                    const file = exist.previewImage.split('/');
                    const existingFile = path.join(__dirname, '../../',envVars.folder,file[file.length - 1]);
                    if(fs.existsSync(existingFile)){
                        fs.unlinkSync(existingFile);
                    }
                }
            }
            const updated = await GiftThemeService.update({_id: id}, data);
            if (updated)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
            else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
        }  catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
    async delete(req: Request, res: Response){
        try {
            const {id} = req.params;
            let exist = await GiftThemeService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const deleted = await GiftThemeService.destroy({_id: id});
            if (deleted) {
                if(exist.previewImage){
                    const file = exist.previewImage.split('/');
                    const existingFile = path.join(__dirname, '../../',envVars.folder,file[file.length - 1]);
                    if(fs.existsSync(existingFile)){
                        fs.unlinkSync(existingFile);
                    }
                }
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
            }
            else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,errors: {}}));
        }  catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).send(
                failure({
                    message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
                    errors: err,
                })
            );
        }
    }
}

export default new GiftThemeController();