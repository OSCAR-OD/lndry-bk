import {Router} from 'express';
// **** Variables **** //
import ItemController from "@controller/admin/ItemController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/item',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), ItemController.add);
router.get(p.get, ItemController.get);
router.get(p.single, ItemController.single);
router.post(p.edit, uploader.single('file'), ItemController.edit);
router.post(p._delete, ItemController._delete);

// **** Export default **** //

export default router;