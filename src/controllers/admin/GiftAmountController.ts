import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { paginate } from "@util/paginate";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
import GiftAmountService from "@services/GiftAmountService";
import {IGiftAmount} from "@models/GiftAmount";
const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    OK,
} = StatusCodes;
class GiftAmountController{
    async add(req: Request, res: Response){
        try {
            const {userPay, userGet} = req.body;
            const validation = new Validator(req.body, {
                userPay: 'required',
                userGet: 'required'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            const created = await GiftAmountService.addAndReturn({userPay, userGet});
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
            let data : any = await GiftAmountService.all();
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
            let data = await GiftAmountService.singleByField({_id: id});
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
            let exist = await GiftAmountService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            let {userPay, userGet} = req.body;
            let validation = new Validator(req.body, {
                userPay: 'required',
                userGet: 'required'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            const data : IGiftAmount = {userPay, userGet, bonus: (userGet - userPay)}
            const updated = await GiftAmountService.update({_id: id}, data);
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
            let exist = await GiftAmountService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const deleted = await GiftAmountService.destroy({_id: id});
            if (deleted)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
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

export default new GiftAmountController();