import {Router} from 'express';
// **** Variables **** //
import ServiceController from "@controller/admin/ServiceController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/service',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), ServiceController.add);
router.get(p.get, ServiceController.get);
router.get(p.single, ServiceController.single);
router.post(p.edit, uploader.single('file'), ServiceController.edit);
router.post(p._delete, ServiceController._delete);

// **** Export default **** //

export default router;