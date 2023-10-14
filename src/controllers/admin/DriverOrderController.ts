import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import {paginate} from "@util/paginate";
import {driverOrderProcess, offeredPriceCalculator, orderProcess} from "@util/order-helper";
import driverOrderService from "@services/driver-order-service";
import {IDriverOrder} from "@models/DriverOrders";
import {IOrder} from "@models/Order";
import orderService from "@services/order-service";
import userService from "@services/user-service";
import {capture, charge} from "@util/stripe";
import jwt from "jsonwebtoken";
import envVars from "@shared/env-vars";
import template from "@views/emails/reset-password.email";
import templateOrder from "@views/emails/orderChangedNotification"

import mailer from "@util/mailer";
import itemService from "@services/item-service";
import couponChecker from "@util/couponChecker";
import couponService from "@services/coupon-service";
import Coupon from "@models/Coupon";
import orderWithDriverFInalInvoice from "@views/emails/orderWithDriverFInalInvoice";

const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;

class DriverOrderController{
    async add(req: Request, res: Response) {
        try {
            return driverOrderProcess(req, res);
        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async get(req: Request, res: Response) {
        try {
            let data:any = await driverOrderService.getAll();
            const {page, size}:any = req.query;
            if(page && size){
                data = await paginate(page, size, data);
            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, data));
        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async edit(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if(!id){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order ID required to update',errors: {}}));
            }
            const order : IDriverOrder | null = await driverOrderService.getSingle(id);
            if(!order){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order not found associated with given ID.',errors: {}}));
            }
            const data = {...req.body};
            let coupon: any = {};
            if (data.couponCode) {
                coupon = await couponChecker(data.couponCode, data.updateOrderData);
            }
            if(data.updateOrderData){
                if ((JSON.stringify(data.updateOrderData) !== JSON.stringify(order.adjustmentProducts))) {
                    //TODO: Update order summary
                    let discounts = 0;
                    let totalAmount = 0;
                    let subTotal = 0;
                    for (let i = 0; i < data.updateOrderData.length; i++) {
                        const el = data.updateOrderData[i];
                        const item = await itemService.getSingle(el.pid);
                        if (!item) {
                            return res
                                .status(BAD_REQUEST)
                                .send(failure(
                                    {message: 'Product do not exist on our record.', errors: {}}
                                ));
                        }
                        const offeredPrice = offeredPriceCalculator(item);
                        const discount = parseFloat((parseFloat(item.price) - offeredPrice).toFixed(2));
                        discounts += discount;
                        subTotal += parseFloat((parseFloat(item.price) * el.quantity).toFixed(2));
                        totalAmount = parseFloat((subTotal - discounts).toFixed(2));
                        data.total = totalAmount;
                        data.subTotal = subTotal;
                        if (coupon.applied) {
                            data.couponDiscount = coupon.discount;
                            data.discount = discounts + parseFloat(<string>coupon.discount);
                            const tm = totalAmount - parseFloat(<string>coupon.discount);
                            data.total = tm < 20 ? 20 : tm;
                        }
                        data.adjustmentProducts = data.updateOrderData;
                    }
                }
            }
            const updated = await driverOrderService.updateOne(id, data);
            if (coupon.applied && order.couponCode !== data.couponCode) {
                //Check if coupon code has a limit to its usage and deduct it
                const coupon = await couponService.getSingleByCode(data.couponCode);
                if (coupon) {
                    const couponLimit = parseFloat(<string>coupon.coupon_limit) - 1;
                    if (couponLimit >= 0) {
                        const updateCoupon = await Coupon.findOneAndUpdate(
                            {code: data.couponCode},
                            {$set: {coupon_limit: couponLimit}},
                            {
                                new: true,
                            }
                        );
                    }
                }
            }
            if (updated){
                const driverOrder = await driverOrderService.getSingle(id);
                if(driverOrder){
                    const html = orderWithDriverFInalInvoice(driverOrder);
                    await mailer.mail(driverOrder.email,'Final Order Summary', html);
                }
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, {data: driverOrder}));
            }
            return res
                .status(UNPROCESSABLE_ENTITY)
                .send(failure({message: 'Could not update.', errors: {}}));

        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async _delete(req: Request, res: Response) {
        try {
            const deleted = await driverOrderService.delete(req.params.id);
            if (deleted)
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, req.body));
            else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,errors: {}}));
        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async single(req: Request, res: Response) {
        try {
            const {id} = req.params;
            let data : IDriverOrder | null = await driverOrderService.getSingle(id);
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
        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }
    
    async capture(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if(!id){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order ID required to update',errors: {}}));
            }
            const order : IDriverOrder | null = await driverOrderService.getSingle(id);
            if(!order){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order not found associated with given ID.',errors: {}}));
            }
            //@ts-ignore
            const payment : any = await capture(order.spi);
            if(payment?.status === 'succeeded') {
                const updated = await driverOrderService.updateOne(id, {
                    initialAmountCaptured: true
                });
                const updatedOrder = await driverOrderService.getSingle(id);
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, {data: updatedOrder, payment}));
            } else
                return res
                    .status(UNPROCESSABLE_ENTITY)
                    .send(failure({message: 'Could not update.', errors: {payment}}));

        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }

    async charge(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if(!id){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order ID required to update',errors: {}}));
            }
            const order : IDriverOrder | null = await driverOrderService.getSingle(id);
            if(!order){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'Order not found associated with given ID.',errors: {}}));
            }
            //@ts-ignore
            let amount = parseFloat(order.total) - parseFloat(order.amountPaid);
            if(order.adjustmentPrice){
                amount = amount + order.adjustmentPrice
            }
            const user = await userService.getByEmail(order.email);
            if(!user){
                return res
                    .status(BAD_REQUEST)
                    .send(failure({message: 'User not found for this order.',errors: {}}));
            }
            //@ts-ignore
            const payment = await charge(user.stripeCustomerID, amount);
            //@ts-ignore
            if(payment?.status === 'succeeded') {
                //Update order
                const updated = await driverOrderService.updateOne(id, {
                    adjustmentPaid: true
                });
                //TODO: Send Email to Customer that amount has been charged.

                // const user = await userService.getByEmail(order.email);
                // if (user) {
                //     const emailSubject = "Order Payment Confirmation";
                //     const emailContent = templatePaymentConfirmation(amount); // Assuming you have an email template function defined
                //
                //     // Send the email
                //     mailer.mail(user.email, emailSubject, emailContent);
                // }

                const updatedOrder = await driverOrderService.getSingle(id);
                return res
                    .status(OK)
                    .send(success(ErrorMessage.HTTP_OK, {data: updatedOrder, payment}));
            } else {
                return res
                    .status(OK)
                    .send(failure({message: 'Could not process payment', errors: payment}));

            }
            return res
                .status(OK)
                .send(success(ErrorMessage.HTTP_OK, {payment}));

        } catch (err) {
            return res
                .status(INTERNAL_SERVER_ERROR)
                .send(failure(
                    {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
                ));
        }
    }
}

export default new DriverOrderController();