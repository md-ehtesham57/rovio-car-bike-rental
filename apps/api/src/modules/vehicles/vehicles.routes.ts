import { Router } from "express";
import * as ctrl from "./vehicles.controller";

const router = Router();

router.get("/", ctrl.listPublic);

export default router;
