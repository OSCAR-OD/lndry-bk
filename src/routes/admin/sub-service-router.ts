import {Router} from 'express';
// **** Variables **** //
import SubServiceController from "@controller/admin/SubServiceController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/sub-service',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id',
  byService: '/by-service/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, SubServiceController.add);
router.get(p.get, SubServiceController.get);
router.get(p.single, SubServiceController.single);
router.post(p.edit, SubServiceController.edit);
router.post(p._delete, SubServiceController._delete);
router.get(p.byService, SubServiceController.byService);

// **** Export default **** //

export default router;