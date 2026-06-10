import { Request, Response, NextFunction } from "express";
import * as vehicleService from "./vehicle.service";
import { ok } from "../../types";

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query;
    const result = await vehicleService.listPublicVehicles({
      page:     parseInt(String(q.page ?? "1")),
      limit:    parseInt(String(q.limit ?? "50")),
      category: q.category ? String(q.category) : undefined,
      search:   q.search ? String(q.search) : undefined,
      order:    q.order === "asc" ? "asc" : "desc",
    });
    res.json(ok("Vehicles fetched.", result));
  } catch (err) { next(err); }
}
