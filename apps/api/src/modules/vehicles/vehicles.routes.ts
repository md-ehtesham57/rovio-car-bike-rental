import { Router } from "express";
import * as ctrl from "./vehicles.controller";

const router = Router();

router.get("/",      ctrl.listPublic);
router.get("/:id",   ctrl.getPublic);

export default router;
