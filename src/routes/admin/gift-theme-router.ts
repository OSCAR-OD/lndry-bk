import {Router} from 'express';
// **** Variables **** //
import GiftThemeController from "@controller/admin/GiftThemeController";
import uploader from "@util/local-uploader";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/gift-theme',
    add: '/add',
    get: '/get',
    single: '/single/:id',
    edit: '/edit/:id',
    _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, uploader.single('file'), GiftThemeController.add);
router.get(p.get, GiftThemeController.getAll);
router.get(p.single, GiftThemeController.single);
router.post(p.edit, uploader.single('file'), GiftThemeController.edit);
router.post(p._delete, GiftThemeController.delete);

// **** Export default **** //

export default router;