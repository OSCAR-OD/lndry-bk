import {Router} from 'express';
// **** Variables **** //
import ContactController from "@controller/admin/ContactController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/quotes',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, ContactController.add);
router.get(p.get, ContactController.get);
router.get(p.single, ContactController.single);
router.post(p.edit, ContactController.edit);
router.post(p._delete, ContactController._delete);

// **** Export default **** //

export default router;