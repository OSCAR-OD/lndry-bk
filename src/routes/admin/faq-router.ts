import {Router} from 'express';
// **** Variables **** //
import FAQController from "@controller/admin/FAQController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/faq',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, FAQController.add);
router.get(p.get, FAQController.get);
router.get(p.single, FAQController.single);
router.post(p.edit, FAQController.edit);
router.post(p._delete, FAQController._delete);

// **** Export default **** //

export default router;