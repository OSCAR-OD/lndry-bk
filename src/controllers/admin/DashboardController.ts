import DriverOrders from "@models/DriverOrders";
import Order from "@models/Order";
import User from "@models/User";
import ErrorMessage from "@shared/errorMessage";
import { failure, success } from "@shared/response";
import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import moment from "moment";

const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  OK,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
} = StatusCodes;

class DashboardController {
  async dashboard(req: Request, res: Response) {
    try {
      const today = moment().startOf("day");

      // today order data count
      const today_order_count: number = await Order.find({
        payment: true,
        createdAt: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      }).count();

      const today_driver_order_count: number = await DriverOrders.find({
        // payment: true,
        createdAt: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      }).count();

      const today_cancelled_order_count: number = await Order.find({
        payment: true,
        status: "Rejected",
        createdAt: {
          $gte: today.toDate(),
          $lte: moment(today).endOf("day").toDate(),
        },
      }).count();

      // totals data count
      const total_user: number = await User.find({}).count();
      const total_order: number = await Order.find({ payment: true }).count();

      const total_driver_order: number = await DriverOrders.find({
        // payment: true,
      }).count();

      const total_completed_order: number = await Order.find({
        payment: true,
        status: "Delivered",
      }).count();

      const total_cancelled_order: number = await Order.find({
        payment: true,
        status: "Rejected",
      }).count();

      const data = {
        today_order_count,
        today_driver_order_count,
        today_cancelled_order_count,
        total_user,
        total_order,
        total_driver_order,
        total_completed_order,
        total_cancelled_order,
      };

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
}

export default new DashboardController();
