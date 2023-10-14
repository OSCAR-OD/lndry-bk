import {Router} from 'express';
// **** Variables **** //
import ReviewController from "@controller/admin/ReviewController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/review',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  approve: '/change-status/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.fields([
  {name: 'file', maxCount: 1},
  {name: 'images', maxCount: 10}
]), ReviewController.add);
router.get(p.get, ReviewController.get);
router.get(p.single, ReviewController.single);
router.post(p.edit, uploader.fields([
  {name: 'file', maxCount: 1},
  {name: 'images', maxCount: 10}
]), ReviewController.edit);
router.post(p.approve, ReviewController.changeStatus);
router.post(p._delete, ReviewController._delete);

// **** Export default **** //

export default router;