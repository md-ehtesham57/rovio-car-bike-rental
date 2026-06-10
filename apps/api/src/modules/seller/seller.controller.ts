import { Response, NextFunction } from "express";
import * as sellerService from "./seller.service";
import { ok, type AuthRequest } from "../../types";

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await sellerService.getSellerStats(req.user!.id);
    res.json(ok("Stats fetched.", stats));
  } catch (err) { next(err); }
}

// ─── List my vehicles ─────────────────────────────────────────────────────────

export async function listVehicles(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query;
    const result = await sellerService.listMyVehicles(req.user!.id, {
      page:      parseInt(String(q.page  ?? "1")),
      limit:     parseInt(String(q.limit ?? "20")),
      status:    q.status ? String(q.status) : undefined,
      available: q.available ? String(q.available) : undefined,
      search:    q.search ? String(q.search) : undefined,
      order:     (q.order === "asc" ? "asc" : "desc"),
    });
    res.json(ok("Vehicles fetched.", result));
  } catch (err) { next(err); }
}

// ─── Get single vehicle ───────────────────────────────────────────────────────

export async function getVehicle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await sellerService.getMyVehicle(String(req.params.id), req.user!.id);
    res.json(ok("Vehicle fetched.", vehicle));
  } catch (err) { next(err); }
}

// ─── Create vehicle ───────────────────────────────────────────────────────────

export async function createVehicle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await sellerService.createVehicle(req.user!.id, req.body);
    res.status(201).json(ok("Vehicle listed. It will be visible after admin review.", vehicle));
  } catch (err) { next(err); }
}

// ─── Update vehicle ───────────────────────────────────────────────────────────

export async function updateVehicle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await sellerService.updateVehicle(String(req.params.id), req.user!.id, req.body);
    res.json(ok("Vehicle updated.", vehicle));
  } catch (err) { next(err); }
}

// ─── Toggle availability ──────────────────────────────────────────────────────

export async function toggleAvailability(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const vehicle = await sellerService.toggleAvailability(String(req.params.id), req.user!.id);
    res.json(ok(`Vehicle marked as ${vehicle.available ? "available" : "unavailable"}.`, vehicle));
  } catch (err) { next(err); }
}

// ─── Delete vehicle ───────────────────────────────────────────────────────────

export async function deleteVehicle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await sellerService.deleteVehicle(String(req.params.id), req.user!.id);
    res.json(ok("Vehicle deleted."));
  } catch (err) { next(err); }
}
