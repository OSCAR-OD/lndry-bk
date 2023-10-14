import Stripe from "stripe";
import envVars from "@shared/env-vars";
import userService from "@services/user-service";
import newUserAddedByOrder from "@views/emails/newUserAddedByOrder";
import mailer from "@util/mailer";
import User from "@models/User";

const stripe = new Stripe(envVars.payment.stripeSecret, {
  apiVersion: "2022-11-15",
  typescript: true
});

const STRIPE = async (amount: number, email: string, name: string, ref:string = '') : Promise<Stripe.PaymentIntent> => {
  //Create customer dynamically
  //Check if user exist or not with given email
  //If user do not exist then create an account for him / her and send
  //Login credentials via email
  const user = await userService.getByEmail(email);
  let stripeCustomerID = user?.stripeCustomerID;
  if(!user) {
    const newUser = await userService.addOne({name: name, email: email, password: 'NL123456', referCode: ref});
    const html = newUserAddedByOrder(email);
    await mailer.mail(email, 'New Account Created', html);
  }
  //Save customer ID to database
  if(!stripeCustomerID){
    const customer: Stripe.Customer = await stripe.customers.create({
      name: name,
      email: email,
    });
    const updateUser = await User.findOneAndUpdate({ email: email },{$set: {stripeCustomerID: customer.id}}).exec();
    stripeCustomerID = customer.id;
  }


  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
    amount: (amount*100),
    currency: 'gbp',
    automatic_payment_methods: {
      enabled: false,
    },
    capture_method: 'manual',
    customer: stripeCustomerID,
    setup_future_usage: 'off_session'
  });

  return paymentIntent;
}

export const capture = async (intent: string) : Promise<unknown> => {
  try {
    const payments = await stripe.paymentIntents.capture(intent);
    return payments;
  } catch (err) {
    return err;
  }
}

export const charge = async (customerId:string, amount: number) : Promise<unknown> => {
  try {
    const  paymentMethod = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    const payments = await stripe.paymentIntents.create({
      amount: (amount * 100),
      currency: 'gbp',
      automatic_payment_methods: {enabled: true},
      customer: customerId,
      payment_method: paymentMethod.data[0].id,
      off_session: true,
      confirm: true
    });

    return payments;
  } catch (err) {
    return err;
  }
}

export default STRIPE;