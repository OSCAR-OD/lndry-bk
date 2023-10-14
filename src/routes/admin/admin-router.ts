import { Router } from "express";
// **** Variables **** //
import DashboardController from "@controller/admin/DashboardController";
// Misc
const router = Router();

// Paths
export const p = {
  basePath: "/",
  dashboard: "/dashboard",
} as const;

// **** Routes **** //
router.get(p.dashboard, DashboardController.dashboard);

// **** Export default **** //

export default router;
