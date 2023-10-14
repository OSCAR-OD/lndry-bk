import {Router} from 'express';
// **** Variables **** //
import SettingsController from "@controller/admin/SettingsController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: '/settings',
  edit: '/edit'
} as const;


// **** Routes **** //
router.get(p.basePath, SettingsController.get);
router.post(p.edit, uploader.single('file'), SettingsController.edit);

// **** Export default **** //

export default router;