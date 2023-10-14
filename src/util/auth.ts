import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import {failure} from "@shared/response";
import envVars from "@shared/env-vars";
import securityRepo from "@repos/security-repo";
import {ISecurity} from "@models/Security";
const {UNAUTHORIZED} = StatusCodes;
export const SECRET_KEY: Secret = 'your-secret-key-here';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (req.header('Authorization') === '') {
      return res.status(UNAUTHORIZED).send(failure({
        message: "No token found on header. Please try again later",
        errors: {}
      }));
    }
    // @ts-ignore
    const decoded = jwt.verify(token, envVars.jwt.secret);
    const loginInfo:ISecurity|null = await securityRepo.getByEmail(decoded.email);
    if(loginInfo?.access_token !== token){
      return res.status(UNAUTHORIZED).send(failure({
        message: "Invalid signature or access token changed. Please try again later",
        errors: {}
      }));
    }
    req.token = decoded;
    next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send(failure({
      message: "Invalid signature. Please try again later",
      errors: err
    }));
  }
};

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.token.role === 'Super admin' || req.token.role === 'Admin') {
      next();
    } else {
      return res.status(UNAUTHORIZED).send(failure({
        message: "You are not authorized for this action. Please ask an admin. Thanks.",
        errors: {
          message: "User is trying to access admin routes with user credentials."
        }
      }));
    }
  } catch (err) {
    return res.status(UNAUTHORIZED).send(failure({
      message: "Invalid signature. Please try again later",
      errors: err
    }));
  }
};