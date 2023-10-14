import {Request, Response} from 'express';
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import StatusCodes from "http-status-codes";
import envVars from "@shared/env-vars";
import STRIPE from "@util/stripe";
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, OK} = StatusCodes;
class PaymentController {
    async config(req: Request, res: Response) {
        try {
            res.send({
                publishableKey: envVars.payment.stripePublic
            });
        }  catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async paymentIntent(req: Request, res: Response) {
        try {
            // const {amount} = req.body;
            // if(!amount){
            //     return res
            //         .status(BAD_REQUEST)
            //         .send(failure(
            //             {message: 'Amount Required', errors: {message: 'Amount Required'}}
            //         ));
            // }
            // const paymentIntent = await STRIPE(amount);
            // return res
            //     .status(OK)
            //     .send(success(ErrorMessage.HTTP_OK, {
            //         clientSecret: paymentIntent.client_secret,
            //         publishableKey: envVars.payment.stripePublic
            //     }));
        }  catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }
}

export default new PaymentController();