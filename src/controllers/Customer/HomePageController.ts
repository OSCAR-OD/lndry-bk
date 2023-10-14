import { default as Blog, IBlog, default as blog } from "@models/Blog";
import Coupon from "@models/Coupon";
import { IFAQ } from "@models/FAQ";
import Item, { IItem } from "@models/Item";
import Order from "@models/Order";
import { IReview } from "@models/Review";
import { ISettings } from "@models/Settings";
import { ISubService } from "@models/SubService";
import User from "@models/User";
import Video from "@models/Video";
import Wallet, { IWallet } from "@models/Wallet";
import userRepo from "@repos/user-repo";
import FreelancerClientService from "@services/FreelancerClientService";
import GiftCardService from "@services/GiftCardService";
import ReferralService from "@services/ReferralService";
import bannerService from "@services/banner-service";
import blogService from "@services/blog-service";
import couponService from "@services/coupon-service";
import driverOrderService from "@services/driver-order-service";
import faqService from "@services/faq-service";
import itemService from "@services/item-service";
import orderService from "@services/order-service";
import reviewService from "@services/review-service";
import serviceAreaService from "@services/service-area-service";
import serviceService from "@services/service-service";
import settingsService from "@services/settings-service";
import subServiceService from "@services/sub-service-service";
import userService from "@services/user-service";
import videoService from "@services/video-service";
import envVars from "@shared/env-vars";
import ErrorMessage from "@shared/errorMessage";
import redisClient from "@shared/redis";
import { failure, success } from "@shared/response";
import couponChecker from "@util/couponChecker";
import mailer from "@util/mailer";
import { driverOrderProcess, offeredPriceCalculator } from "@util/order-helper";
import { paginate } from "@util/paginate";
import STRIPE from "@util/stripe";
import orderCompletionEmail from "@views/emails/orderCompletionEmail";
import axios from "axios";
import bcrypt from "bcryptjs";
import * as console from "console";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import Validator from "validatorjs";

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
} = StatusCodes;

class HomePageController {
  async homePage(req: Request, res: Response) {
    try {
      /***********************************************************************************************
       * Information/Data need on this API return
       * 1. Services (Only main ones not including sub services)
       * 3. Banners (All)
       * 4. Discounted items (All)
       * 5. Popular Items (All)
       * 6. Banner for app promotion (All)
       * 7. Videos (All)
       * 8. Blogs (All)
       * NOTE: I will not follow current architecture. Instead, will do some nontraditional approach
       * To make sure everything is custom and do not need to change other code for this few APIs.
       * home-main
       * app-promotion
       * service-main
       ************************************************************************************************/
      const services = await serviceService.getAll();
      const mainBanner = await bannerService.getAllByPosition("home-main");
      const appPromotion = await bannerService.getAllByPosition(
        "home-promotional"
      );
      const discountedItems: any = await itemService.getAllForHomePage(
        "discount"
      );
      const popularItems: any = await itemService.getAllForHomePage("popular");
      const videos = await Video.find().limit(5);
      const blogs = await Blog.aggregate([
        {
          $project: {
            image: 1,
            keywords: 1,
            visitorCount: 1,
            createdAt: 1,
            title: 1,
            slug: 1,
            published: 1,
            drafted: 1,
            description: { $substrBytes: ["$description", 0, 78] },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .limit(10)
        .exec();
      const data = {
        services,
        mainBanner,
        appPromotion,
        discountedItems: discountedItems,
        popularItems: popularItems,
        videos: videos.splice(videos.length - 10, videos.length),
        blogs: blogs,
      };
      await redisClient.setEx(
        "homePage",
        envVars.redisTime,
        JSON.stringify(data)
      );
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

  async videos(req: Request, res: Response) {
    try {
      const mainBanner = await bannerService.getAllByPosition("video-main");
      const videos = await videoService.getAll();
      const data = {
        mainBanner,
        videos: videos,
      };
      await redisClient.setEx(
        "videos",
        envVars.redisTime,
        JSON.stringify(data)
      );
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

  async services(req: Request, res: Response) {
    try {
      const services = await serviceService.getAll();
      await redisClient.setEx(
        "services",
        envVars.redisTime,
        JSON.stringify(services)
      );
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, services));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  //Send data for service page
  async service(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const services = await serviceService.getAll();
      const service = await serviceService.getSingleBySlug(
        slug.split("-").join(" ")
      );
      if (!service && slug !== "all-service") {
        return res.status(BAD_REQUEST).send(
          failure({
            message: BAD_REQUEST,
            errors: { msg: ErrorMessage.HTTP_BAD_REQUEST },
          })
        );
      }
      let subServices: ISubService[] | null;
      let products: IItem[];
      const mainBanner = await bannerService.getAllByPosition("main");
      if (slug !== "all-service") {
        subServices = await subServiceService.getByService(service?._id);
        products = await Item.find({ service: service?._id }).select(
          "-description -metaTitle -metaDescription -keywords"
        );
      } else {
        subServices = await subServiceService.getAll();
        products = await itemService.getAll();
      }
      const data = {
        service,
        services,
        subServices,
        products,
        mainBanner,
      };
      await redisClient.setEx(
        "service-" + slug,
        envVars.redisTime,
        JSON.stringify(data)
      );
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

  //Send data for blogs page
  async blogs(req: Request, res: Response) {
    try {
      const q = req.query.q;
      let data: any = await blogService.getAll();
      const { page, size }: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      const mainBanner = await bannerService.getAllByPosition("blog-main");
      data = { ...data, mainBanner };
      await redisClient.setEx("blogs", envVars.redisTime, JSON.stringify(data));
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

  //Send data for blog page
  async blog(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug || slug === "") {
        return res.status(BAD_REQUEST).send(
          failure({
            message: BAD_REQUEST,
            errors: { msg: ErrorMessage.HTTP_BAD_REQUEST },
          })
        );
      }
      const data: IBlog | null = await blogService.getSingleBySlug(
        req.params.slug
      );
      const mainBanner = await bannerService.getAllByPosition("blogs-main");
      if (!data) {
        return res.status(OK).send(
          failure({
            message: "Data not found",
            errors: { msg: "Data not found" },
          })
        );
      }
      const vc = (data.visitorCount ?? 0) + 1;
      const updateVisitorCount = await blog.findOneAndUpdate(
        { slug: req.params.slug },
        { visitorCount: vc },
        {
          new: true,
        }
      );
      return res.status(OK).send(
        success(ErrorMessage.HTTP_OK, {
          data,
          mainBanner,
          hello: updateVisitorCount,
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

  async product(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug || slug === "") {
        return res.status(BAD_REQUEST).send(
          failure({
            message: BAD_REQUEST,
            errors: { msg: ErrorMessage.HTTP_BAD_REQUEST },
          })
        );
      }
      const data: IItem | null = await itemService.getSingleBySlug(slug);
      if (!data) {
        return res.status(OK).send(
            failure({
              message: "Data not found",
              errors: { msg: "Data not found" },
            })
        );
      }
      if(data){
        const reviews: IReview[] | null = await reviewService.getApprovedByProduct(<string>data._id);
        let avgReview = 0;
        if (reviews) {
          for (let i = 0; i < reviews.length; i++) {
            // @ts-ignore
            avgReview += parseFloat(reviews[i].rating);
          }
          avgReview = avgReview / reviews.length;
        }
        const faqs: IFAQ[] | null = await faqService.getByProductID(<string>data._id);
        await redisClient.setEx(
            "product-" + slug,
            envVars.redisTime,
            JSON.stringify({ data, reviews, faqs, avgReview })
        );
        return res
            .status(OK)
            .send(success(ErrorMessage.HTTP_OK, { data, reviews, faqs }));
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

  async serviceAreas(req: Request, res: Response) {
    try {
      const { postcode } = req.body;
      let validation = new Validator(req.body, {
        postcode: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      const serviceAreas = await serviceAreaService.getSingleByPostCode(
        postcode
      );
      if (!serviceAreas) {
        return res.status(OK).send(
          failure({
            message: "Service area not found.",
            errors: { message: "Service area not found" },
          })
        );
      }
      const addresses = await axios.get(
        `https://api.getAddress.io/find/${postcode}`,
        {
          headers: {
            "api-key": "xrrX7OblBkit67ZcEewbgg39511",
          },
        }
      );
      await redisClient.set(
        "area-" + postcode,
        JSON.stringify({
          ...serviceAreas,
          postCode: postcode,
          addresses: addresses.data,
        })
      );
      return res.status(OK).send(
        success(ErrorMessage.HTTP_OK, {
          ...serviceAreas,
          postCode: postcode,
          addresses: addresses.data,
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

  async checkCoupon(req: Request, res: Response) {
    try {
      const { coupon, cart } = req.body;
      let validation = new Validator(req.body, {
        coupon: "required",
        cart: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      const checkCoupon = await couponChecker(coupon, cart);
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, { ...checkCoupon }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async orderWithDriver(req: Request, res: Response) {
    try {
      return await driverOrderProcess(req, res);
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async order(req: Request, res: Response) {
    try {
      const { orderData } = req.body;
      let validation = new Validator(orderData, {
        postCode: "required",
        streetAddress: "required",
        collectionDate: "required",
        collectionTime: "required",
        deliveryDate: "required",
        deliveryTime: "required",
        email: "required",
        name: "required",
        billingPostcode: "required",
        billingStreetAddress: "required",
        mobile: "required",
        cart: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      const order = { ...orderData };
      order.collectionTime = order.collectionTime.value;
      order.deliveryTime = order.deliveryTime.value;
      let products = [];
      let discounts = 0;
      let totalAmount = 0;
      let subTotal = 0;
      let carts = [];
      for (let i = 0; i < orderData.cart.length; i++) {
        products.push({
          id: orderData.cart[i].pid,
          quantity: orderData.cart[i].quantity,
        });
        const item = await itemService.getSingle(orderData.cart[i].pid);
        if (!item) {
          return res.status(BAD_REQUEST).send(
            failure({
              message: "Product do not exist on our record.",
              errors: {},
            })
          );
        }
        const offeredPrice = offeredPriceCalculator(item);
        // @ts-ignore
        const discount = parseFloat(
          (parseFloat(item.price) - offeredPrice).toFixed(2)
        );
        discounts += discount;
        subTotal += parseFloat(
          (
            parseFloat(orderData.cart[i].product.price) *
            orderData.cart[i].quantity
          ).toFixed(2)
        );
        const cart = {
          pid: orderData.cart[i].pid,
          quantity: orderData.cart[i].quantity,
          price: orderData.cart[i].price,
          product: item,
        };
        // @ts-ignore
        delete cart.product.description;
        carts.push(cart);
      }
      order.cart = JSON.stringify(carts);
      totalAmount = parseFloat((subTotal - discounts).toFixed(2));
      order.discount = discounts;
      order.subTotal = subTotal;
      order.total = totalAmount < 20 ? 20 : totalAmount;
      //TODO: Check coupon in this end and update order + coupon accordingly
      if (orderData.couponCode) {
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
      }
      //Check if this user exist and have previous ref code then set current ref code to null
      if (orderData.referCode) {
        const currentUser = await User.findOne({ email: order.email });
        if (
          currentUser?.referCodeDeactivated ||
          currentUser?.referralCode === orderData.referCode
        ) {
          orderData.referCode = null;
        }
      }
      const paymentIntent = await STRIPE(
        envVars.defaultPaymentAmount,
        orderData.email,
        orderData.name,
        orderData.referCode
      );
      order.paymentIntent = paymentIntent.client_secret;
      const freelanced = await FreelancerClientService.singleByField({
        customerEmail: order.email,
      });
      if (freelanced) {
        await FreelancerClientService.update(
          { _id: freelanced._id },
          { totalOrder: freelanced.totalOrder + 1 }
        );
        order.freelancerID = freelanced.freelancerID;
      }
      const saved: any = await orderService.addOne(order);
      if (saved?.outcome) {
        return res.status(OK).send(
          success(ErrorMessage.HTTP_OK, {
            order: saved.data,
            paymentIntent: paymentIntent.client_secret,
            price: saved.data.total,
          })
        );
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

  async orderCompletion(req: Request, res: Response) {
    try {
      const { info } = req.body;
      let validation = new Validator(info, {
        order_id: "required",
        payment_intent: "required",
        payment_intent_client_secret: "required",
        redirect_status: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      let order: any = await orderService.getSingle(info.order_id);
      if (order) {
        if (order?.payment) {
          return res.status(OK).send(
            failure({
              message: "Payment was successful.",
              errors: "Payment was successful.",
            })
          );
        }
        if (order.paymentIntent !== info.payment_intent_client_secret) {
          return res.status(OK).send(
            failure({
              message:
                "Payment not recognized. Please contact customer service.",
              errors:
                "Payment intent created from nearest laundry does not match completion payment intent.",
            })
          );
        }
        const update = await orderService.updateOne(order._id, {
          spi: info.payment_intent,
          payment: true,
          amountPaid: envVars.defaultPaymentAmount,
        });
        if (order.couponCode) {
          //Check if coupon code has a limit to its usage and deduct it
          const coupon = await couponService.getSingleByCode(order.couponCode);
          if (coupon) {
            const couponLimit = parseFloat(<string>coupon.coupon_limit) - 1;
            console.log(couponLimit);
            if (couponLimit >= 0) {
              const updateCoupon = await Coupon.findOneAndUpdate(
                { code: order.couponCode },
                { $set: { coupon_limit: couponLimit } },
                {
                  new: true,
                }
              );
            }
          }
        }
        if (order.referCode) {
          //Deactivate refer code of this order customer
          const user = await User.findOneAndUpdate(
            { email: order.email },
            { $set: { referCodeDeactivated: true } }
          ).exec();

          const referrer = await User.findOne({
            referralCode: order.referCode,
          });
          //   let date = new Date();
          //   date.setDate(date.getDate() + 30);
          const referral = await ReferralService.add({
            referrerID: referrer?._id,
            userEmail: order.email,
            referrerGet: envVars.defaultReferralAmount,
            userGet: envVars.defaultReferralAmount,
            // referrerAmountExpire: date,
            // userAmountExpire: date,
          });
        }
        const html = orderCompletionEmail(order);
        await mailer.mail("info@nearestlaundry.com", "Order created.", html);
        const userUpdate = await User.findOneAndUpdate(
          { email: order.email },
          { $set: { previousOrderPostCode: order.postCode } },
          { new: true }
        );
        if (update)
          return res.status(OK).send(success("Payment status updated", {}));
        else
          return res.status(BAD_REQUEST).send(
            failure({
              message: "Could not update order.",
              errors:
                "We could not update Payment status. Please contact support",
            })
          );
      } else {
        order = await driverOrderService.getSingle(info.order_id);
        if (order.payment) {
          return res.status(OK).send(
            failure({
              message: "Payment was successful.",
              errors: "Payment was successful.",
            })
          );
        }
        if (order.paymentIntent !== info.payment_intent_client_secret) {
          return res.status(OK).send(
            failure({
              message:
                "Payment not recognized. Please contact customer service.",
              errors:
                "Payment intent created from nearest laundry does not match completion payment intent.",
            })
          );
        }
        const update = await driverOrderService.updateOne(order._id, {
          spi: info.payment_intent,
          payment: true,
          amountPaid: envVars.defaultPaymentAmount,
        });
        //update user
        const userUpdate = await User.findOneAndUpdate(
          { email: order.email },
          { $set: { previousOrderPostCode: order.postCode } },
          { new: true }
        );
        // const html = orderCompletionEmail(order);
        // await mailer.mail(order.email, "Order created.", html);
        const html = orderCompletionEmail(order);
        await mailer.mail("info@nearestlaundry.com", "Order created.", html);
        if (update)
          return res.status(OK).send(success("Payment status updated", {}));
        else
          return res.status(BAD_REQUEST).send(
            failure({
              message: "Could not update order.",
              errors:
                "We could not update Payment status. Please contact support",
            })
          );
      }
      return res.status(UNPROCESSABLE_ENTITY).send(
        failure({
          message: "We could not process the payment.",
          errors: "We could not update Payment status. Please contact support",
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

  async dashboard(req: Request, res: Response) {
    try {
      const orders = await orderService.getAllByEmail(req.token.email);
      const driverOrders = await driverOrderService.getAllByEmail(
        req.token.email
      );
      // @ts-ignore
      const totalOrder = orders?.length + driverOrders?.length;

      let orderAmount = 0;
      orders?.map((item, index) => {
        orderAmount += parseFloat(item.total);
      });
      driverOrders?.map((item, index) => {
        orderAmount += 20;
      });
      const user = await userService.getByEmailNotForPassword(req.token.email);
      const referralOrder = await Order.find({
        referCode: user?.referralCode,
        payment: true,
      });
      const cards = await GiftCardService.allByField({
        toEmail: req.token.email,
        payment: true,
      });

      const data = {
        totalOrder,
        orderAmount,
        referralOrder: referralOrder?.length ?? 0,
        orders,
        driverOrders,
        user: user,
        userWallet: {},
        giftCards: cards,
        freelancerClient: [],
        freelancerOrders: [],
        totalClientOrder: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        availableBalance: 0,
        JSS: 0,
      };

      const userWallet: IWallet | null = await Wallet.findOne({
        userID: user?._id,
      });

      if (userWallet) {
        data.userWallet = userWallet;
      } else {
        data.userWallet = { availableBalance: 0, history: [] };
      }

      if (user?.role === "Freelancer") {
        data.freelancerClient = await FreelancerClientService.allByField({
          freelancerID: user._id,
        });
        // @ts-ignore
        data.freelancerOrders = await Order.find({
          freelancerID: user._id,
        }).select("customID createdAt name total payment status email");
      }
      // await redisClient.setEx('dashboard-'+req.token.email, envVars.redisTime, JSON.stringify(data));
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

  async updateUser(req: Request, res: Response) {
    try {
      const { user } = req.body;
      if (!user) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: "User not found",
          })
        );
      }
      const id = user._id;
      delete user._id;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.__v;
      const updated = await userService.updateOne(req.token.email, user);
      if (updated) {
        return res.status(OK).send(
          success(ErrorMessage.HTTP_OK, {
            message: "User updated successfully",
          })
        );
      }
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: "Tried to update but could not.",
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

  async changePassword(req: Request, res: Response) {
    try {
      const { passwords } = req.body;
      let validation = new Validator(passwords, {
        password: "required|min:8|confirmed",
        currentPassword: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      const user = await userRepo.getByEmail(req.token.email);
      if (!user) {
        return res.status(OK).send(
          failure({
            message: "Credentials did not match our records.",
            errors: {},
          })
        );
      }
      if (user.accountStatus !== "Active") {
        return res.status(UNAUTHORIZED).send(
          failure({
            message: "Account is not active.",
            errors: {},
          })
        );
      }
      const isMatch = bcrypt.compareSync(
        passwords.currentPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(OK).send(
          failure({
            message: "Credentials did not match our records.",
            errors: {},
          })
        );
      }
      await userRepo.updatePassword(passwords.password, req.token.email);
      return res.status(OK).send(success("Password reset successful.", {}));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async orderInfo(req: Request, res: Response) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: "Order ID required",
          })
        );
      }
      const order = await orderService.getSingle(id);
      if (!order) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: "Order not found",
          })
        );
      }
      return res.status(OK).send(
        success("Order found.", {
          oid: order._id,
          price: order.total,
          paymentIntent: order.paymentIntent,
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

  async siteSettings(req: Request, res: Response) {
    try {
      let data: ISettings | null = await settingsService.getAll();
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

  async search(req: Request, res: Response) {
    try {
      const query = req.query.q;
      const rgx = (pattern: any) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(query);
      const products = await Item.aggregate([
        {
          $match: {
            $or: [{ name: { $regex: searchRgx, $options: "i" } }],
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "service",
            foreignField: "_id",
            as: "services",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            services: 1,
            price: 1,
          },
        },
      ]).exec();
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, { products }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async adminSearch(req: Request, res: Response) {
    try {
      const query = req.query.q;
      const rgx = (pattern: any) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(query);
      const products = await Item.aggregate([
        {
          $match: {
            $or: [{ name: { $regex: searchRgx, $options: "i" } }],
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            services: 1,
            price: 1,
            offerAmount: 1,
            offerType: 1,
          },
        },
      ]).exec();
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, { products }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async review(req: Request, res: Response) {
    try {
      const { item, description, rating } = req.body;
      let validation = new Validator(req.body, {
        item: "required",
        rating: "required",
        description: "required",
      });
      if (validation.fails()) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: ErrorMessage.HTTP_BAD_REQUEST,
            errors: validation.errors.errors,
          })
        );
      }
      const user = await userService.getByEmail(req.token.email);
      if (!user) {
        return res.status(BAD_REQUEST).send(
          failure({
            message: "User does not exist.",
            errors: { error: "User does not exist with this token." },
          })
        );
      }
      const reqFiles: any = req.files;
      let images = [];
      if (reqFiles.images) {
        const files = reqFiles.images;
        for (let i = 0; i < files.length; i++) {
          images.push(`https://${req.get("host")}/${files[i].filename}`);
        }
      }
      const data: IReview = {
        item,
        //@ts-ignore
        customer: user._id,
        customerName: user.name,
        image:
          user.image ??
          `https://ui-avatars.com/api/?name=${user.name.replace(/ /g, "+")}`,
        images,
        description,
        rating,
      };
      const created = await reviewService.addOne(data);
      if (created)
        return res.status(OK).send(success(ErrorMessage.HTTP_OK, { data }));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, { data }));
    } catch (err) {
      return res.status(INTERNAL_SERVER_ERROR).send(
        failure({
          message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR,
          errors: err,
        })
      );
    }
  }

  async updateItemForSlug(req: Request, res: Response){
    try {
      const items = await itemService.getAll();
      items.map(async (item, key)=>{
        const update = await Item.findOneAndUpdate(
            {_id: item._id},
            {$set: {slug: item.name.toLowerCase().replaceAll(" ", "-")}},
            {new: true}).exec()
      });
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, { data: await itemService.getAll() }));
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

export default new HomePageController();
