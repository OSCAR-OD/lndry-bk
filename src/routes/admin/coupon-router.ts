import {Router} from 'express';
// **** Variables **** //
import CouponController from "@controller/admin/CouponController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/coupon',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, CouponController.add);
router.get(p.get, CouponController.get);
router.get(p.single, CouponController.single);
router.post(p.edit, CouponController.edit);
router.post(p._delete, CouponController._delete);

// **** Export default **** //

export default router;