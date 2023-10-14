import {Router} from 'express';
// **** Variables **** //
import BlogController from "@controller/admin/BlogController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/blog',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), BlogController.add);
router.get(p.get, BlogController.get);
router.get(p.single, BlogController.single);
router.post(p.edit, uploader.single('file'), BlogController.edit);
router.post(p._delete, BlogController._delete);

// **** Export default **** //

export default router;