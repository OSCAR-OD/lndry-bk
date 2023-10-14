import {Router} from 'express';
// **** Variables **** //
import ServiceAreaController from "@controller/admin/ServiceAreaController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/service-area',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, ServiceAreaController.add);
router.get(p.get, ServiceAreaController.get);
router.get(p.single, ServiceAreaController.single);
router.post(p.edit, ServiceAreaController.edit);
router.post(p._delete, ServiceAreaController._delete);

// **** Export default **** //

export default router;