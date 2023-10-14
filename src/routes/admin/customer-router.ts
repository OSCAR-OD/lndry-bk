import {Router} from 'express';
// **** Variables **** //
import UserController from "@controller/admin/UserController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/customers',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), UserController.add);
router.get(p.get, UserController.get);
router.get(p.single, UserController.single);
router.post(p.edit, uploader.single('file'), UserController.edit);
router.post(p._delete, UserController._delete);

// **** Export default **** //

export default router;