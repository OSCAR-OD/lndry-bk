import {Router} from 'express';
// **** Variables **** //
import ServiceContentController from "@controller/admin/ServiceContentController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/service-content',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), ServiceContentController.add);
router.get(p.get, ServiceContentController.get);
router.get(p.single, ServiceContentController.single);
router.post(p.edit, uploader.single('file'), ServiceContentController.edit);
router.post(p._delete, ServiceContentController._delete);

// **** Export default **** //

export default router;