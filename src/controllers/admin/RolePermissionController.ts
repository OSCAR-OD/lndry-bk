import {Request, Response} from 'express';
import StatusCodes from 'http-status-codes';
const {INTERNAL_SERVER_ERROR, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK, UNAUTHORIZED} = StatusCodes;
import {failure, success} from "@shared/response";
import ErrorMessage from "@shared/errorMessage";
import Validator from 'validatorjs';
import rolePermissionService from "@services/role-permission-service";
import {IRolePermissions} from "@models/RolePermissions";
import {paginate} from "@util/paginate";
import permissions from "@util/permissions";
class RolePermissionController {
  async freshSeed(req: Request, res: Response) {
    try {
      let data:any = await rolePermissionService.seed();
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

  async get(req: Request, res: Response) {
    try {
      const {page, size, role}:any = req.query;
      let data:any;
      if(role) data = await rolePermissionService.getSingle(role);
      else data = await rolePermissionService.getAll();
      if(page && size){
        if(role) data = data.permissions;
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
      const {role, permissions} = req.body;
      let validation = new Validator(req.body, {
        role: 'required',
        permissions: 'required|array'
      });
      if (validation.fails()) {
        return res
          .status(BAD_REQUEST)
          .send(failure(
            {message: ErrorMessage.HTTP_BAD_REQUEST, errors: validation.errors.errors}
          ));
      }
      let data:IRolePermissions = {role, permissions};
      const updated = await rolePermissionService.updateOne(role,data);
      if (updated)
        return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, req.body));
      else
        return res
          .status(UNPROCESSABLE_ENTITY)
          .send(success(ErrorMessage.HTTP_UNPROCESSABLE_ENTITY, req.body));
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
      const deleted = await rolePermissionService.delete(req.params.role);
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
      const {role} = req.params;
      let data : IRolePermissions | null = await rolePermissionService.getSingle(role);
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

  async permissions(req: Request, res: Response) {
    try {
      return res
          .status(OK)
          .send(success(ErrorMessage.HTTP_OK, {permissions}));
    } catch (err) {
    return res
        .status(INTERNAL_SERVER_ERROR)
        .send(failure(
            {message: ErrorMessage.HTTP_INTERNAL_SERVER_ERROR, errors: err}
        ));
  }
  }
}

export default new RolePermissionController();