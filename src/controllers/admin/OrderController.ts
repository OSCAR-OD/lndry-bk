import Coupon from "@models/Coupon";
import FreelancerClient, { IFreelancerClient } from "@models/FreelancerClient";
import { IOrder } from "@models/Order";
import Referral, { IReferral } from "@models/Referral";
import User, { IUser } from "@models/User";
import Wallet, { IWallet } from "@models/Wallet";
import couponService from "@services/coupon-service";
import itemService from "@services/item-service";
import orderService from "@services/order-service";
import userService from "@services/user-service";
import envVars from "@shared/env-vars";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import couponChecker from "@util/couponChecker";
import mailer from "@util/mailer";
import { offeredPriceCalculator, orderProcess } from "@util/order-helper";
import { paginate } from "@util/paginate";
import { capture, charge } from "@util/stripe";
import orderEmail from "@views/emails/orderEmail";
import console from "console";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  OK,
  UNAUTHORIZED,
} = StatusCodes;

class OrderController {
  async add(req: Request, res: Response) {
    try {
      const order: any = await orderProcess(req, res);
      if (order?.paymentIntent) {
        const saved: any = await orderService.addOne(order);
        if (saved?.outcome) {
          return res.status(OK).send(
            success(ErrorMessage.HTTP_OK, {
              order: saved.data,
              paymentIntent: order.paymentIntent,
            })
          );
        }
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

  async get(req: Request, res: Response) {
    try {
      let data: any = await orderService.getAll();
      const { page, size }: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
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
      let coupon: any = {};
      const { id } = req.params;
      if (!id) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({ message: "Order ID required to update", errors: {} })
          );
      }
      const order: IOrder | null = await orderService.getSingle(id);
      if (!order) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: "Order not found associated with given ID.",
            errors: {},
          })
        );
      }
      const data = { ...req.body };
      if (data.couponCode) {
        coupon = await couponChecker(data.couponCode, data.updateOrderData);
      }
      if (data.updateOrderData) {
        if (
          JSON.stringify(data.updateOrderData) !==
          JSON.stringify(order.adjustmentProducts)
        ) {
          //TODO: Update order summary
          let discounts = 0;
          let totalAmount = 0;
          let subTotal = 0;
          for (let i = 0; i < data.updateOrderData.length; i++) {
            const el = data.updateOrderData[i];
            const item = await itemService.getSingle(el.pid);
            if (!item) {
              return res.status(BAD_REQUEST).send(
                failure({
                  message: "Product do not exist on our record.",
                  errors: {},
                })
              );
            }
            const offeredPrice = offeredPriceCalculator(item);
            const discount = parseFloat(
              (parseFloat(item.price) - offeredPrice).toFixed(2)
            );
            discounts += discount;
            subTotal += parseFloat(
              (parseFloat(item.price) * el.quantity).toFixed(2)
            );
          }
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
          console.log(data);
        }
      }

      const updated = await orderService.updateOne(id, data);
      if (coupon.applied && order.couponCode !== data.couponCode) {
        //Check if coupon code has a limit to its usage and deduct it
        const coupon = await couponService.getSingleByCode(data.couponCode);
        if (coupon) {
          const couponLimit = parseFloat(<string>coupon.coupon_limit) - 1;
          if (couponLimit >= 0) {
            const updateCoupon = await Coupon.findOneAndUpdate(
              { code: data.couponCode },
              { $set: { coupon_limit: couponLimit } },
              {
                new: true,
              }
            );
          }
        }
      }
      if (updated) {
        const updatedOrder = await orderService.getSingle(id);
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { data: updatedOrder }));
      }

      return res
        .status(UNPROCESSABLE_ENTITY)
        .send(failure({ message: "Could not update.", errors: {} }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async _delete(req: Request, res: Response) {
    try {
      const deleted = await orderService.delete(req.params.id);
      if (deleted)
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res.status(UNPROCESSABLE_ENTITY).send(
          failure({
            message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY,
            errors: {},
          })
        );
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
      const { id } = req.params;
      let data: IOrder | null = await orderService.getSingle(id);
      if (!data) {
        return res
          .status(OK)
          .send(failure({ message: ErrorMessage.HTTP_NO_CONTENT, errors: {} }));
      }
      if (data) {
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, data));
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

  async capture(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({ message: "Order ID required to update", errors: {} })
          );
      }

      const order: IOrder | null = await orderService.getSingle(id);

      if (!order) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: "Order not found associated with given ID.",
            errors: {},
          })
        );
      }

      // get user
      const user: IUser | null = await User.findOne({
        email: order.email,
      });

      // check order has referrer
      if (order.referCode) {
        // get refer record
        const referRecord: IReferral | null = await Referral.findOne({
          userEmail: order.email,
        });

        // if refer amount not paid yet then distribute the amount
        if (referRecord && !referRecord.paid) {
          // => Referral
          // get referral wallet
          let referralWallet: IWallet | null = await Wallet.findOne({
            userID: referRecord?.referrerID,
          });

          // get referral balance
          let referralBalance = referralWallet
            ? referralWallet.availableBalance + referRecord.referrerGet
            : referRecord.referrerGet;

          // if referralWallet exist then update else create wallet
          const referralWalletHistory = {
            kind: "referral_reward",
            amount: referRecord.referrerGet,
            effect: "Cr",
            description: `£ ${referRecord.referrerGet} amount credited for referring a user`,
          };

          if (referralWallet) {
            await Wallet.updateOne(
              { _id: referralWallet._id },
              {
                availableBalance: referralBalance,
                $push: { history: referralWalletHistory },
              }
            );
          } else {
            referralWallet = await Wallet.create({
              userID: referRecord?.referrerID,
              availableBalance: referRecord.referrerGet,
              history: [referralWalletHistory],
            });
          }

          // => User

          // get user wallet
          let userWallet: IWallet | null = await Wallet.findOne({
            userID: user?._id,
          });

          // get user balance
          let userBalance = userWallet
            ? userWallet.availableBalance + referRecord.userGet
            : referRecord.userGet;

          // if userWallet exist then update else create wallet
          const userWalletHistory = {
            kind: "referral_reward_user",
            amount: referRecord.userGet,
            effect: "Cr",
            description: `£ ${referRecord.userGet} amount credited for using refer code`,
          };

          if (userWallet) {
            await Wallet.updateOne(
              { _id: userWallet?._id },
              {
                availableBalance: userBalance,
                $push: { history: userWalletHistory },
              }
            );
          } else {
            userWallet = await Wallet.create({
              userID: user?._id,
              availableBalance: userBalance,
              history: [userWalletHistory],
            });
          }

          // update the referral paid status to true
          await Referral.updateOne(
            {
              userEmail: order.email,
            },
            {
              paid: true,
            }
          );
        }
      }

      let freelancerPaid = order.freelancerPaid;

      // check order has freelancer && freelance amount not paid yet
      if (order.freelancerID && !freelancerPaid) {
        // get freelancer client record
        const freelancerClient: IFreelancerClient | null =
          await FreelancerClient.findOne({
            freelancerID: order.freelancerID,
            customerEmail: order.email,
          });

        const freelancer: IUser | null = await User.findOne({
          _id: order.freelancerID,
        });

        // get freelancer wallet
        let freelancerWallet: IWallet | null = await Wallet.findOne({
          userID: order.freelancerID,
        });

        // referrerGet: envVars.defaultReferralAmount,
        // userGet: envVars.defaultReferralAmount,

        let freelanceShare = freelancer?.freelanceShare
          ? freelancer?.freelanceShare
          : envVars.defaultFreelanceShare;

        let freelancerMaxGetPerOrder = freelancer?.freelancerMaxGetPerOrder
          ? freelancer?.freelancerMaxGetPerOrder
          : envVars.defaultFreelancerMaxGetPerOrder;

        let freelanceAmount: number =
          (parseFloat(order.total) * freelanceShare) / 100;

        // get freelancer balance
        let freelancerBalance = freelancerWallet
          ? freelancerWallet.availableBalance + freelanceAmount
          : freelanceAmount;

        if (freelanceAmount > freelancerMaxGetPerOrder) {
          freelanceAmount = freelancerMaxGetPerOrder;
        }

        // if freelancerWallet exist then update else create wallet
        const freelancerWalletHistory = {
          kind: "freelancer_order",
          amount: freelanceAmount,
          effect: "Cr",
          description: `£ ${freelanceAmount} amount credited for freelancing a order`,
        };

        if (freelancerWallet) {
          await Wallet.updateOne(
            { _id: freelancerWallet._id },
            {
              availableBalance: freelancerBalance,
              $push: { history: freelancerWalletHistory },
            }
          );
        } else {
          freelancerWallet = await Wallet.create({
            userID: order.freelancerID,
            availableBalance: freelancerBalance,
            history: [freelancerWalletHistory],
          });
        }

        freelancerPaid = true;
      }

      //@ts-ignore
      const payment: any = await capture(order.spi);
      if (payment?.status === "succeeded") {
        const updated = await orderService.updateOne(id, {
          initialAmountCaptured: true,
          freelancerPaid: true,
        });
        const updatedOrder = await orderService.getSingle(id);
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { data: updatedOrder, payment }));
      } else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(failure({ message: "Could not update.", errors: { payment } }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async charge(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({ message: "Order ID required to update", errors: {} })
          );
      }
      const order: IOrder | null = await orderService.getSingle(id);
      if (!order) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: "Order not found associated with given ID.",
            errors: {},
          })
        );
      }
      //@ts-ignore
      let amount = parseFloat(order.total) - parseFloat(order.amountPaid);
      if (order.adjustmentPrice) {
        amount = amount + order.adjustmentPrice;
      }
      const user = await userService.getByEmail(order.email);
      if (!user) {
        return res
          .status(BAD_REQUEST)
          .send(
            failure({ message: "User not found for this order.", errors: {} })
          );
      }
      //@ts-ignore
      const payment = await charge(user.stripeCustomerID, amount);
      //@ts-ignore
      if (payment?.status === "succeeded") {
        //Update order
        const updated = await orderService.updateOne(id, {
          adjustmentPaid: true,
        });
        //TODO: Send Email to Customer that amount has been charged.
        if (order) {
          const html = orderEmail(order);
          await mailer.mail(order.email, "Final Order Summary", html);
        }
        const updatedOrder = await orderService.getSingle(id);
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, { data: updatedOrder, payment }));
      } else {
        return res
          .status(OK)
          .send(
            failure({ message: "Could not process payment", errors: payment })
          );
      }
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, { payment }));
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

export default new OrderController();
