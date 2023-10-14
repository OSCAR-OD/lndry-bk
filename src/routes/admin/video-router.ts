import {Router} from 'express';
// **** Variables **** //
import VideoController from "@controller/admin/VideoController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/video',
  add: '/add',
  get: '/get',
  single: '/single/:id',
  edit: '/edit/:id',
  _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, VideoController.add);
router.get(p.get, VideoController.get);
router.get(p.single, VideoController.single);
router.post(p.edit, VideoController.edit);
router.post(p._delete, VideoController._delete);

// **** Export default **** //

export default router;