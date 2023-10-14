import {Router} from 'express';
// **** Variables **** //
import OrderController from "@controller/admin/OrderController";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/order',
    add: '/add',
    get: '/get',
    single: '/single/:id',
    edit: '/edit/:id',
    capture: '/capture/:id',
    charge: '/charge/:id',
    _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, OrderController.add);
router.get(p.get, OrderController.get);
router.get(p.single, OrderController.single);
router.post(p.edit, OrderController.edit);
router.post(p._delete, OrderController._delete);
router.post(p.capture, OrderController.capture);
router.post(p.charge, OrderController.charge);

// **** Export default **** //

export default router;