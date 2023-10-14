import {Router} from 'express';
// **** Variables **** //
import GiftAmountController from "@controller/admin/GiftAmountController";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/gift-price',
    add: '/add',
    get: '/get',
    single: '/single/:id',
    edit: '/edit/:id',
    _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, GiftAmountController.add);
router.get(p.get, GiftAmountController.getAll);
router.get(p.single, GiftAmountController.single);
router.post(p.edit, GiftAmountController.edit);
router.post(p._delete, GiftAmountController.delete);

// **** Export default **** //

export default router;