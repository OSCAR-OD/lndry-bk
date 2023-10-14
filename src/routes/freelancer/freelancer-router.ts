import {Router} from 'express';
// **** Variables **** //
import FreelancerClientController from "@controller/Freelancer/FreelancerClientController";
// Misc
const router = Router();

// Paths
export const p = {
    basePath: '/freelancer-client',
    add: '/add',
    get: '/get',
    single: '/single/:id',
    edit: '/edit/:id',
    _delete: '/delete/:id'
} as const;


// **** Routes **** //
//Register a user
router.post(p.add, FreelancerClientController.add);
router.get(p.get, FreelancerClientController.getAll);
router.get(p.single, FreelancerClientController.single);
router.post(p.edit, FreelancerClientController.edit);
router.post(p._delete, FreelancerClientController.delete);

// **** Export default **** //

export default router;