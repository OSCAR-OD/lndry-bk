import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { paginate } from "@util/paginate";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";
import FreelancerClientService from "@services/FreelancerClientService";
import {IFreelancerClient} from "@models/FreelancerClient";
import userService from "@services/user-service";
import {Schema, Types} from "mongoose";
import console from "console";
// import ObjectId from "mongoose"
const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    UNPROCESSABLE_ENTITY,
    OK,
} = StatusCodes;
class GiftAmountController{
    async add(req: Request, res: Response){
        try {
            let {email} = req.body;
            let validation = new Validator(req.body, {
                email: 'required|email'
            });
            const freelancer = await userService.getByEmail(req.token.email);
            if(!freelancer){
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            const exist = await FreelancerClientService.singleByField({customerEmail: email});
            if(exist){
                return res
                    .status(OK)
                    .send(failure({message: "This customer is already under another freelancer", errors: {}}));
            }
            const created = await FreelancerClientService.addAndReturn({freelancerID: freelancer._id, customerEmail: email});
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
            let data : any = await FreelancerClientService.all();
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
            let data = await FreelancerClientService.singleByField({_id: id});
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
            let exist = await FreelancerClientService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            let {email} = req.body;
            let validation = new Validator(req.body, {
                email: 'required|email'
            });
            if (validation.fails()) {
                return res
                    .status(BAD_REQUEST)
                    .send(failure(
                        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
                    ));
            }
            const freelancer = await userService.getByEmail(req.token.email);
            if(!freelancer){
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            // @ts-ignore
            if(freelancer._id.toString() !== exist.freelancerID.toString()){
                return res
                    .status(OK)
                    .send(failure({message: "You can not edit another freelancers customer", errors: {}}));
            }

            const data : any = {freelancerID: freelancer._id, customerEmail: email};
            const updated = await FreelancerClientService.update({_id: id}, data);
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
            let exist = await FreelancerClientService.singleByField({_id: id});
            if(!exist) {
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            const freelancer = await userService.getByEmail(req.token.email);
            if(!freelancer){
                return res
                    .status(OK)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            // @ts-ignore
            if(freelancer._id.toString() !== exist.freelancerID.toString()){
                return res
                    .status(OK)
                    .send(failure({message: "You can not edit another freelancers customer", errors: {}}));
            }
            const deleted = await FreelancerClientService.destroy({_id: id});
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
