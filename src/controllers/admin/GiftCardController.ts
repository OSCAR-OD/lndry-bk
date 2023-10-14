import ErrorMessage from "@shared/errorMessage";
import {failure, success} from "@shared/response";
import {paginate} from "@util/paginate";
import {Request, Response} from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
import GiftCardService from "@services/GiftCardService";
import {IGiftTheme} from "@models/GiftTheme";
import path from "path";
import fs from "fs";
import envVars from "@shared/env-vars";
import GiftAmountService from "@services/GiftAmountService";

const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    OK,
    UNAUTHORIZED,
} = StatusCodes;

class GiftCardController {
    async add(req: Request, res: Response) {
        try {
            const {
                fromName,
                fromEmail,
                fromPhone,
                toName,
                toEmail,
                toPhone,
                message,
                priceID,
                template,
                customPrice
            } = req.body;
            let validation = new Validator(req.body, {
                fromName: 'required|string',
                fromEmail: 'required|string|email',
                toName: 'required|string',
                toEmail: 'required|string|email',
                toPhone: 'string',
                message: 'required|string',
                template: 'required|string',
                priceID: 'string'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            if(!priceID && !customPrice){
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: "At least price ID or custom price required.", errors: validation.errors.errors}
                    ));
            }
            let userGet : number = <number>customPrice;
            let userPaid : number = <number>customPrice;
            let bonus = 0;
            const price = await GiftAmountService.singleByField({_id: priceID});
            if(price){
                userGet = price.userGet;
                userPaid = price.userPay;
                bonus = price.bonus;
            }
            let data = {
                fromName,
                fromEmail,
                fromPhone,
                toName,
                toEmail,
                toPhone,
                message,
                userGet,
                userPaid,
                bonus,
                template
            };
            const created = await GiftCardService.addAndReturn(data);
            if (created)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, created));
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

    async getAll(req: Request, res: Response) {
        try {
            let data: any = await GiftCardService.all();
            const {page, size}: any = req.query;
            if (page && size) {
                data = await paginate(page, size, data);
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, data));
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
            const {id} = req.params;
            let data = await GiftCardService.singleByField({_id: id});
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
            const {id} = req.params;
            let exist = await GiftCardService.singleByField({_id: id});
            if (!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const {
                fromName,
                fromEmail,
                fromPhone,
                toName,
                toEmail,
                toPhone,
                message,
                priceID,
                template,
                customPrice
            } = req.body;
            let validation = new Validator(req.body, {
                fromName: 'required|string',
                fromEmail: 'required|string|email',
                toName: 'required|string',
                toEmail: 'required|string|email',
                toPhone: 'required|string',
                message: 'required|string',
                template: 'required|string',
                priceID: 'string'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            if(!priceID && !customPrice){
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: "At least price ID or custom price required.", errors: validation.errors.errors}
                    ));
            }
            let userGet : number = <number>customPrice;
            let userPaid : number = <number>customPrice;
            let bonus = 0;
            const price = await GiftAmountService.singleByField({_id: priceID});
            if(price){
                userGet = price.userGet;
                userPaid = price.userPay;
                bonus = price.bonus;
            }
            let data = {
                fromName,
                fromEmail,
                fromPhone,
                toName,
                toEmail,
                toPhone,
                message,
                priceID,
                userGet,
                userPaid,
                bonus,
                template
            };
            const updated = await GiftCardService.update({_id: id}, data);
            if (updated)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
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

    async delete(req: Request, res: Response) {
        try {
            const {id} = req.params;
            let exist = await GiftCardService.singleByField({_id: id});
            if (!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const deleted = await GiftCardService.destroy({_id: id});
            if (deleted) {
                if (exist.previewImage) {
                    const file = exist.previewImage.split('/');
                    const existingFile = path.join(__dirname, '../../', envVars.folder, file[file.length - 1]);
                    if (fs.existsSync(existingFile)) {
                        fs.unlinkSync(existingFile);
                    }
                }
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
            } else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, errors: {}}));
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

export default new GiftCardController();