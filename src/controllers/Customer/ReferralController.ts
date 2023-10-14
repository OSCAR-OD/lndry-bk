import {Request, Response} from "express";
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import StatusCodes from "http-status-codes";
import userService from "@services/user-service";
import Validator from "validatorjs";
import {ISettings} from "@models/Settings";
import settingsRepo from "@repos/settings-repo";
import referralEmail from "@views/emails/referralEmail";
import mailer from "@util/mailer";
const {
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    OK,
    UNAUTHORIZED,
} = StatusCodes;
class ReferralController{
    async generateReferralCode(req: Request, res: Response){
        try {
            const user = await userService.getByEmail(req.token.email);
            if(!user){
                return res
                    .status(UNAUTHORIZED)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            if(!user.referralCode){
                const newCode = Math.round(Math.random() * 1E9).toString();
                user.referralCode = newCode;
                await userService.updateOne(user.email, user);
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, {referralCode: user.referralCode}));
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

    async sendReferralCodeByEmail(req: Request, res: Response){
        try {
            const user = await userService.getByEmail(req.token.email);
            if(!user){
                return res
                    .status(UNAUTHORIZED)
                    .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
            }
            let validation = new Validator(req.body, {
                email: "required|email"
            });
            if (validation.fails()) {
                return res.status(BAD_REQUEST).send(
                    failure({
                        message: ErrorMessage.HTTP_BAD_REQUEST,
                        errors: validation.errors.errors,
                    })
                );
            }
            if(!user.referralCode){
                const newCode =Math.round(Math.random() * 1E9).toString();
                user.referralCode = newCode;
                await userService.updateOne(user.email, user);
            }
            const exist = await userService.getByEmail(req.body.email);
            if(exist){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: "There is an account available with this email in the records of Nearest Laundry.", errors: {}}));
            }
            const existing:ISettings|null = await settingsRepo.get();
            if(!existing){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: "Kill site admin of Nearest laundry as soon as possible.", errors: {}}));
            }
            const html = referralEmail(user.name, existing.referrerGet, existing.customerGet,'https://www.nearestlaundry.com/sign-up?ref='+user.referralCode);
            await mailer.mail(req.body.email, 'You got referral from Nearest Laundry!!!!', html);
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, "Referral link was sent to the email you provided."));
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

export default new ReferralController()

