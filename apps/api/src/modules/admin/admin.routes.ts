import { Router } from "express";
import * as ctrl from "./admin.controller";
import { requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { adminLimiter } from "../../middleware/ratelimit.middleware";
import { updateUserRoleSchema, updateBookingStatusSchema } from "../../lib/schemas";
import { z } from "zod";

const router = Router();

// All admin routes: rate-limited + authenticate + role:admin
router.use(adminLimiter, ...requireAdmin);

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", ctrl.getDashboard);

// ─── Users ────────────────────────────────────────────────────────────────────
router.get   ("/users",            ctrl.listUsers);
router.get   ("/users/:id",        ctrl.getUser);
router.patch ("/users/:id/role",   validate(updateUserRoleSchema), ctrl.updateUserRole);
router.post  ("/users/:id/ban",    ctrl.banUser);
router.post  ("/users/:id/unban",  ctrl.unbanUser);
router.delete("/users/:id",        ctrl.deleteUser);

// ─── Vehicles ─────────────────────────────────────────────────────────────────
router.get   ("/vehicles",               ctrl.listVehicles);
router.patch ("/vehicles/:id/status",
  validate(z.object({ status: z.enum(["active", "inactive", "pending_review"]) })),
  ctrl.updateVehicleStatus,
);
router.delete("/vehicles/:id",           ctrl.deleteVehicle);

// ─── Bookings ─────────────────────────────────────────────────────────────────
router.get  ("/bookings",          ctrl.listBookings);
router.patch("/bookings/:id/status", validate(updateBookingStatusSchema), ctrl.updateBookingStatus);

export default router;
