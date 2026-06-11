import { Router } from "express";
import * as ctrl from "./seller.controller";
import * as uploadCtrl from "./upload.controller";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upload } from "../../middleware/upload.middleware";
import { createVehicleSchema, updateVehicleSchema } from "../../lib/schemas";

const router = Router();

// All seller routes require a valid JWT + seller role
router.use(authenticate, requireRole("seller"));

router.get   ("/stats",                                        ctrl.getStats);
router.get   ("/vehicles",                                     ctrl.listVehicles);
router.get   ("/vehicles/:id",                                 ctrl.getVehicle);
router.post  ("/vehicles",      validate(createVehicleSchema), ctrl.createVehicle);
router.put   ("/vehicles/:id",  validate(updateVehicleSchema), ctrl.updateVehicle);
router.patch ("/vehicles/:id/availability",                    ctrl.toggleAvailability);
router.delete("/vehicles/:id",                                 ctrl.deleteVehicle);

// ─── Image upload ──────────────────────────────────────────────────────────────
router.post  ("/upload",   upload.single("image"), uploadCtrl.uploadImage);
router.delete("/uploads/:filename",                  uploadCtrl.deleteImage);

export default router;
