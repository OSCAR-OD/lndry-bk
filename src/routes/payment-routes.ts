import {Router} from 'express';
import PaymentController from "@controller/Customer/PaymentController";

export const p = {
    basePath: '/',
    config: '/config',
    paymentIntent: '/create-payment-intent'
} as const;
// Init
const customerApi = Router();

customerApi.post(p.config, PaymentController.config);
customerApi.post(p.paymentIntent, PaymentController.paymentIntent);

export default customerApi;