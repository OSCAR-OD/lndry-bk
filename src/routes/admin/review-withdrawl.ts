import {Router} from 'express';
// **** Variables **** //
import ReviewWithdrawlController from "@controller/admin/ReviewWithdrawlController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/reviewWithdrawl',
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
]), ReviewWithdrawlController.add);
router.get(p.get, ReviewWithdrawlController.get);
router.get(p.single, ReviewWithdrawlController.single);
router.post(p.edit, uploader.fields([
  {name: 'file', maxCount: 1},
  {name: 'images', maxCount: 10}
]), ReviewWithdrawlController.edit);
router.post(p.approve, ReviewWithdrawlController.changeStatus);
router.post(p._delete, ReviewWithdrawlController._delete);

// **** Export default **** //

export default router;