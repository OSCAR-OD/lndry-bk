import {Router} from 'express';
// **** Variables **** //
import BannerController from "@controller/admin/BannerController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/banner',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), BannerController.add);
router.get(p.get, BannerController.get);
router.get(p.single, BannerController.single);
router.post(p.edit, uploader.single('file'), BannerController.edit);
router.post(p._delete, BannerController._delete);

// **** Export default **** //

export default router;