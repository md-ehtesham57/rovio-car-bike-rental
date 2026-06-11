import mongoose from "mongoose";
import { Vehicle } from "./vehicle.model";
import { Booking } from "../bookings/booking.model";
import { AppError } from "../../middleware/error.middleware";
import { paginate } from "../../types";
import type { z } from "zod";
import type { createVehicleSchema } from "../../lib/schemas";

type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

// ─── List seller's own vehicles ───────────────────────────────────────────────

export async function listMyVehicles(
  sellerId: string,
  query: {
    page: number;
    limit: number;
    status?: string;
    available?: string;
    search?: string;
    order: "asc" | "desc";
  },
) {
  const { page, limit, status, available, search, order } = query;
  const filter: Record<string, unknown> = { sellerId };

  if (status)    filter.status = status;
  if (available) filter.available = available === "true";
  if (search)    filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Vehicle.find(filter)
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Vehicle.countDocuments(filter),
  ]);

  return paginate(items, total, page, limit);
}

// ─── Get one vehicle (must belong to seller) ──────────────────────────────────

export async function getMyVehicle(vehicleId: string, sellerId: string) {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, sellerId }).lean();
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return vehicle;
}

// ─── Create vehicle ───────────────────────────────────────────────────────────

export async function createVehicle(sellerId: string, data: CreateVehicleInput) {
  const vehicle = await Vehicle.create({ ...data, sellerId, status: "pending_review" });
  return vehicle;
}

// ─── Update vehicle (seller can only update their own, and only if not active booking) ──

export async function updateVehicle(
  vehicleId: string,
  sellerId: string,
  data: Partial<CreateVehicleInput>,
) {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, sellerId });
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  const activeBooking = await Booking.findOne({
    vehicleId,
    status: { $in: ["confirmed", "active"] },
  });
  if (activeBooking) {
    throw new AppError("Cannot edit a vehicle with active bookings", 409);
  }

  Object.assign(vehicle, data);
  const reviewFields = ["pricePerDay", "name", "categories", "description"] as const;
  const changed = reviewFields.some((f) => f in data);
  if (changed && vehicle.status === "active") {
    vehicle.status = "pending_review";
  }

  await vehicle.save();
  return vehicle;
}

// ─── Toggle availability ──────────────────────────────────────────────────────

export async function toggleAvailability(vehicleId: string, sellerId: string) {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, sellerId });
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  if (vehicle.status !== "active") throw new AppError("Vehicle must be approved before toggling availability", 400);

  vehicle.available = !vehicle.available;
  await vehicle.save();
  return vehicle;
}

// ─── Delete vehicle ───────────────────────────────────────────────────────────

export async function deleteVehicle(vehicleId: string, sellerId: string) {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, sellerId });
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  const activeBooking = await Booking.findOne({
    vehicleId,
    status: { $in: ["confirmed", "active"] },
  });
  if (activeBooking) {
    throw new AppError("Cannot delete a vehicle with active bookings", 409);
  }

  await vehicle.deleteOne();
}

// ─── Seller stats ─────────────────────────────────────────────────────────────

// ─── Public single vehicle ─────────────────────────────────────────────────

export async function getPublicVehicle(vehicleId: string) {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, status: "active", available: true }).lean();
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return vehicle;
}

// ─── Public listing (active + available) ────────────────────────────────────

export async function listPublicVehicles(query: {
  page?: number; limit?: number; category?: string;
  search?: string; order?: "asc" | "desc";
}) {
  const { page = 1, limit = 20, category, search, order = "desc" } = query;
  const filter: Record<string, unknown> = { status: "active", available: true };

  if (category && category !== "All") filter.categories = category;
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ name: re }, { brand: re }, { type: re }];
  }

  const [items, total] = await Promise.all([
    Vehicle.find(filter)
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-sellerId")
      .lean(),
    Vehicle.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getSellerStats(sellerId: string) {
  const sellerObjId = new mongoose.Types.ObjectId(sellerId);

  const [vehicleStats, bookingStats] = await Promise.all([
    Vehicle.aggregate([
      { $match: { sellerId: sellerObjId } },
      {
        $group: {
          _id: null,
          total:          { $sum: 1 },
          active:         { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          pending_review: { $sum: { $cond: [{ $eq: ["$status", "pending_review"] }, 1, 0] } },
          inactive:       { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
          available:      { $sum: { $cond: ["$available", 1, 0] } },
        },
      },
    ]),
    Booking.aggregate([
      {
        $lookup: {
          from:         "vehicles",
          localField:   "vehicleId",
          foreignField: "_id",
          as:           "vehicle",
        },
      },
      { $unwind: "$vehicle" },
      {
        $match: {
          "vehicle.sellerId": sellerObjId,
        },
      },
      {
        $group: {
          _id:          null,
          totalBookings: { $sum: 1 },
          totalRevenue:  { $sum: { $cond: [{ $in: ["$status", ["completed", "active"]] }, "$totalPrice", 0] } },
          active:        { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          confirmed:     { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        },
      },
    ]),
  ]);

  return {
    vehicles: vehicleStats[0] ?? { total: 0, active: 0, pending_review: 0, inactive: 0, available: 0 },
    bookings: bookingStats[0] ?? { totalBookings: 0, totalRevenue: 0, active: 0, confirmed: 0 },
  };
}
