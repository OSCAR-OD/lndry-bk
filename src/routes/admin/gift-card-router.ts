import {Router} from 'express';
// **** Variables **** //
import GiftCardController from "@controller/admin/GiftCardController";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/gift-card',
    add: '/add',
    get: '/get',
    single: '/single/:id',
    edit: '/edit/:id',
    _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, GiftCardController.add);
router.get(p.get, GiftCardController.getAll);
router.get(p.single, GiftCardController.single);
router.post(p.edit, GiftCardController.edit);
router.post(p._delete, GiftCardController.delete);

// **** Export default **** //

export default router;