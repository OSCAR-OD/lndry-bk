import blogService from "@services/blog-service";
import itemService from "@services/item-service";
import serviceService from "@services/service-service";
import redisClient from "@shared/redis";
import * as console from "console";
import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status-codes";
import {success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
const { OK } = StatusCodes;
const isCached = (key: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = await redisClient.get(key);
    if (data) {
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, JSON.parse(data)));
    } else {
      next();
    }
  };
};

export const isCachedParams = (key: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const data = await redisClient.get(key + slug);
    if (data) {
      return res
        .status(OK)
        .send(success(ErrorMessage.HTTP_OK, JSON.parse(data)));
    } else {
      next();
    }
  };
};
export const isCachedSA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { postcode } = req.body;
    const data = await redisClient.get("area-" + postcode);
    if (data) {
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, JSON.parse(data)));
    } else {
      next();
    }
};
export const isCachedDash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log(req.token.email);
    const data = await redisClient.get("dashboard-" + req.token.email);
    if (data) {
      return res.status(OK).send(success(ErrorMessage.HTTP_OK, JSON.parse(data)));
    } else {
      next();
    }
};

export const clearCaches = async () => {
  try {
    await redisClient.del("services");
    await redisClient.del("homePage");
    await redisClient.del("videos");
    await redisClient.del("blogs");
    const services = await serviceService.getAll();
    for (let i = 0; i < services.length; i++) {
      await redisClient.del(
        "service-" + services[i].name.toLowerCase().replaceAll(" ", "-")
      );
    }
    const blogs = await blogService.getAll();
    for (let i = 0; i < blogs.length; i++) {
      await redisClient.del("blog-" + blogs[i].slug);
    }
    const items = await itemService.getAll();
    for (let i = 0; i < items.length; i++) {
      await redisClient.del(
        "product-" +
          items[i].name.toLowerCase().replaceAll(" ", "-") +
          "+*+NLP" +
          items[i]._id
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export default isCached;
