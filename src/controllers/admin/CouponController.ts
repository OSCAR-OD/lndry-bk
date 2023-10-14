import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';

const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import couponService from "@services/coupon-service";
import {paginate} from "@util/paginate";
import {ICoupon} from "@models/Coupon";
import Service from "@models/Service";
import serviceService from "@services/service-service";
import itemService from "@services/item-service";

class CouponController {
  async add(req: Request, res: Response) {
    try {
      let {
        name,
        code,
        services,
        items,
        amount,
        type,
        start_date,
        end_date,
        minimum_order_limit,
        maximum_order_limit,
        coupon_limit
      } = req.body;
      let validation = new Validator(req.body, {
        name: 'required', code: 'required', amount: 'required|numeric', type: 'required',
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure({message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}));
      }
      if (services === 'all') {
        services = await serviceService.getAllIds();
      }
      if (items === 'all') {
        items = await itemService.getAllIds()
      }
      const created = await couponService.addOne({
        name,
        code,
        services,
        items,
        amount,
        type,
        start_date,
        end_date,
        minimum_order_limit,
        maximum_order_limit,
        coupon_limit
      });
      if (created) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, req.body)); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async get(req: Request, res: Response) {
    try {
      let data: any = await couponService.getAll();
      const {page, size}: any = req.query;
      if (page && size) {
        data = await paginate(page, size, data);
      }
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, data));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async edit(req: Request, res: Response) {
    try {
      let {
        name,
        code,
        services,
        items,
        amount,
        type,
        start_date,
        end_date,
        minimum_order_limit,
        maximum_order_limit,
        coupon_limit
      } = req.body;
      let validation = new Validator(req.body, {
        name: 'required', code: 'required', amount: 'required|numeric', type: 'required',
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure({message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}));
      }
      if (services === 'all') {
        services = await serviceService.getAllIds();
      }
      if (items === 'all') {
        items = await itemService.getAllIds()
      }
      const data = {
        name,
        code,
        services,
        items,
        amount,
        type,
        start_date,
        end_date,
        minimum_order_limit,
        maximum_order_limit,
        coupon_limit
      };
      const updated = await couponService.updateOne(req.params.id, data);
      if (updated) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, req.body)); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async _delete(req: Request, res: Response) {
    try {
      const deleted = await couponService.delete(req.params.id);
      if (deleted) return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, req.body)); else return res
        .status(UNPROCESSABLE_ENTITY)
        .send(failure({message: ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, errors: {}}));
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }

  async single(req: Request, res: Response) {
    try {
      const {id} = req.params;
      let data: ICoupon | null = await couponService.getSingle(id);
      if (!data) {
        return res
          .status(OK)
          .send(failure({message: ErrorMessage.HTTP_NO_CONTENT, errors: {}}));
      }
      if (data) {
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, data));
      }
    } catch (err) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure({message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}));
    }
  }
}

export default new CouponController();