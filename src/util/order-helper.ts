import {Request, Response} from 'express';
import Validator from "validatorjs";
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import STRIPE from "@util/stripe";
import StatusCodes from "http-status-codes";
import envVars from "@shared/env-vars";
import driverOrderService from "@services/driver-order-service";
import itemService from "@services/item-service";
import couponChecker from "@util/couponChecker";
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;

const cartProcess = (cart:any) => {

}

export const offeredPriceCalculator = (product:any) => {
  let op = parseFloat(product.price);
  if(product.offerAmount > 0){
    if(product.offerType === 'percentage') {
      op = op - ((product.offerAmount/100) * op);
    } else {
      op = op - product.offerAmount;
    }
  }
  return parseFloat(op.toFixed(2));
}

export const orderProcess = async (req: Request, res: Response) => {
  const {orderData} = req.body;
  let validation = new Validator(orderData, {
    postCode: 'required',
    streetAddress: 'required',
    collectionDate: 'required',
    collectionTime: 'required',
    deliveryDate: 'required',
    deliveryTime: 'required',
    email: 'required',
    name: 'required',
    billingPostcode: 'required',
    billingStreetAddress: 'required',
    mobile: 'required',
    cart: 'required'
  });
  if (validation.fails()) {
    return res
      .status(BAD_REQUEST)
      .send(failure(
        {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
      ));
  }
  const order = {...orderData};
  order.collectionTime = order.collectionTime.value;
  order.deliveryTime = order.deliveryTime.value;
  let products = [];
  let discounts = 0;
  let totalAmount = 0;
  let subTotal = 0;
  let carts = [];
  for (let i=0; i<orderData.cart.length; i++){
    products.push({
      id: orderData.cart[i].pid,
      quantity: orderData.cart[i].quantity
    });
    const item = await itemService.getSingle(orderData.cart[i].pid);
    if(!item){
      return res
          .status(BAD_REQUEST)
          .send(failure(
              {message: 'Product do not exist on our record.', errors: {}}
          ));
    }
    const offeredPrice = offeredPriceCalculator(item);
    const discount = parseFloat((parseFloat(item.price) - offeredPrice).toFixed(2));
    discounts += discount;
    subTotal += parseFloat((parseFloat(orderData.cart[i].product.price) * orderData.cart[i].quantity).toFixed(2));
    const cart = {
      pid: orderData.cart[i].pid,
      quantity: orderData.cart[i].quantity,
      price: orderData.cart[i].price,
      product: item,
    }
    // @ts-ignore
    delete cart.product.description;
    carts.push(cart);
  }
  order.cart = JSON.stringify(carts);
  totalAmount = parseFloat((subTotal - discounts).toFixed(2));
  order.discount = discounts;
  order.subTotal = subTotal;
  order.total = totalAmount;
  const checkCoupon = await couponChecker(
      orderData.couponCode,
      orderData.cart
  );
  if (checkCoupon.applied) {
    order.couponCode = orderData.couponCode;
    order.couponDiscount = checkCoupon.discount;
    order.discount = discounts + parseFloat(<string>checkCoupon.discount);
    const tm = totalAmount - parseFloat(<string>checkCoupon.discount);
    order.total = tm < 20 ? 20 : tm;
  }
  const paymentIntent = await STRIPE(envVars.defaultPaymentAmount, orderData.email, orderData.name);
  order.paymentIntent = paymentIntent.client_secret;

  return order;
}

export const driverOrderProcess = async (req: Request, res: Response) => {
  try {
    const {orderInfo} = req.body;
    let validation = new Validator(orderInfo, {
      postCode: 'required',
      streetAddress: 'required',
      collectionDate: 'required',
      collectionTime: 'required',
      deliveryDate: 'required',
      deliveryTime: 'required',
      email: 'required',
      name: 'required',
      billingPostcode: 'required',
      billingStreetAddress: 'required',
      mobile: 'required'
    });
    if (validation.fails()) {
      return res
          .status(BAD_REQUEST)
          .send(failure(
              {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
    }
    for (let i=0; i<orderInfo.items.length; i++){
      const item = orderInfo.items[i];
      validation = new Validator(item, {
        service: 'required',
        quantity: 'required'
      });
      if (validation.fails()) {
        return res
            .status(BAD_REQUEST)
            .send(failure(
                {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
            ));
      }
      orderInfo.items[i].name = orderInfo.items[i].service;
      delete orderInfo.items[i].service;
    }
    const paymentIntent = await STRIPE(envVars.defaultPaymentAmount, orderInfo.email, orderInfo.name);
    orderInfo.collectionTime = orderInfo.collectionTime.value;
    orderInfo.deliveryTime = orderInfo.deliveryTime.value;
    orderInfo.paymentIntent = paymentIntent.client_secret;
    const newOrder : any = await driverOrderService.addOne(orderInfo);
    if(newOrder?.outcome){
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, {
        orderInfo: newOrder.data,
        paymentIntent: paymentIntent.client_secret
      }));
    }
  } catch (err) {
    return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
            {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
  }
}

export default cartProcess;