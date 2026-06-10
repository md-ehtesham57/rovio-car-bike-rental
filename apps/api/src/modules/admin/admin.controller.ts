import { Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { ok } from "../../types";
import type { AuthRequest } from "../../types";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(ok("Dashboard stats fetched.", stats));
  } catch (err) { next(err); }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query;
    const result = await adminService.listUsers({
      page:     parseInt(String(q.page  ?? "1")),
      limit:    parseInt(String(q.limit ?? "20")),
      role:     q.role ? String(q.role) : undefined,
      verified: q.verified ? String(q.verified) : undefined,
      search:   q.search ? String(q.search) : undefined,
      order:    q.order === "asc" ? "asc" : "desc",
    });
    res.json(ok("Users fetched.", result));
  } catch (err) { next(err); }
}

export async function getUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await adminService.getUser(String(req.params.id));
    res.json(ok("User fetched.", user));
  } catch (err) { next(err); }
}

export async function updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { role } = req.body as { role: "user" | "admin" | "seller" };
    const user = await adminService.updateUserRole(String(req.params.id), role);
    res.json(ok("User role updated.", user));
  } catch (err) { next(err); }
}

export async function banUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await adminService.banUser(String(req.params.id));
    res.json(ok("User banned.", user));
  } catch (err) { next(err); }
}

export async function unbanUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await adminService.unbanUser(String(req.params.id));
    res.json(ok("User unbanned.", user));
  } catch (err) { next(err); }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await adminService.deleteUser(String(req.params.id), req.user!.id);
    res.json(ok("User deleted."));
  } catch (err) { next(err); }
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function listVehicles(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query;
    const result = await adminService.listAllVehicles({
      page:      parseInt(String(q.page  ?? "1")),
      limit:     parseInt(String(q.limit ?? "20")),
      category:  q.category ? String(q.category) : undefined,
      status:    q.status ? String(q.status) : undefined,
      available: q.available ? String(q.available) : undefined,
      search:    q.search ? String(q.search) : undefined,
      order:     q.order === "asc" ? "asc" : "desc",
    });
    res.json(ok("Vehicles fetched.", result));
  } catch (err) { next(err); }
}

export async function updateVehicleStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: "active" | "inactive" | "pending_review" };
    const vehicle = await adminService.updateVehicleStatus(String(req.params.id), status);
    res.json(ok("Vehicle status updated.", vehicle));
  } catch (err) { next(err); }
}

export async function deleteVehicle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await adminService.deleteVehicle(String(req.params.id));
    res.json(ok("Vehicle deleted."));
  } catch (err) { next(err); }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function listBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const q = req.query;
    const result = await adminService.listAllBookings({
      page:      parseInt(String(q.page  ?? "1")),
      limit:     parseInt(String(q.limit ?? "20")),
      status:    q.status ? String(q.status) : undefined,
      vehicleId: q.vehicleId ? String(q.vehicleId) : undefined,
      userId:    q.userId ? String(q.userId) : undefined,
      order:     q.order === "asc" ? "asc" : "desc",
    });
    res.json(ok("Bookings fetched.", result));
  } catch (err) { next(err); }
}

export async function updateBookingStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: "confirmed" | "active" | "completed" | "cancelled" };
    const booking = await adminService.updateBookingStatus(String(req.params.id), status);
    res.json(ok("Booking status updated.", booking));
  } catch (err) { next(err); }
}
