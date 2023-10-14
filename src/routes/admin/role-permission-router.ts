import {Router} from 'express';
// **** Variables **** //
import RolePermissionController from "@controller/admin/RolePermissionController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/role-permission',
  freshSeed: '/fresh-seed',
  get: '/get',
  single: '/single/:role',
  edit: '/edit',
  permissions: '/permissions',
  _delete: '/delete/:role'
} as const;


// **** Routes **** //
router.get(p.freshSeed, RolePermissionController.freshSeed); //Don't need documentation for this api
router.get(p.get, RolePermissionController.get);
router.get(p.single, RolePermissionController.single);
router.post(p.edit, RolePermissionController.edit);
router.post(p._delete, RolePermissionController._delete);
router.get(p.permissions, RolePermissionController.permissions);

// **** Export default **** //

export default router;