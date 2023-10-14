import {Router} from 'express';
// **** Variables **** //
import DriverOrderController from "@controller/admin/DriverOrderController";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/driver-order',
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
router.post(p.add, DriverOrderController.add);
router.get(p.get, DriverOrderController.get);
router.get(p.single, DriverOrderController.single);
router.post(p.edit, DriverOrderController.edit);
router.post(p.capture, DriverOrderController.capture);
router.post(p.charge, DriverOrderController.charge);
router.post(p._delete, DriverOrderController._delete);

// **** Export default **** //

export default router;