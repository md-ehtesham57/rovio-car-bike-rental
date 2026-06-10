import mongoose from "mongoose";
import { User } from "../auth/user.model";
import { Vehicle } from "../vehicles/vehicle.model";
import { Booking } from "../bookings/booking.model";
import { AppError } from "../../middleware/error.middleware";
import { paginate } from "../../types";
import type { VehicleStatus } from "../vehicles/vehicle.model";

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const now    = new Date();
  const month  = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalVehicles,
    totalBookings,
    activeBookings,
    pendingVehicles,
    revenueResult,
    monthlyRevenueResult,
    bookingsByStatus,
    vehiclesByCategory,
    recentBookings,
  ] = await Promise.all([
    User.countDocuments(),
    Vehicle.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: { $in: ["confirmed", "active"] } }),
    Vehicle.countDocuments({ status: "pending_review" }),

    Booking.aggregate([
      { $match: { status: { $in: ["completed", "active"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Booking.aggregate([
      { $match: { status: { $in: ["completed", "active"] }, createdAt: { $gte: month } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Vehicle.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
    ]),

    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId",   "name email")
      .populate("vehicleId", "name brand emoji")
      .lean(),
  ]);

  return {
    totals: {
      users:           totalUsers,
      vehicles:        totalVehicles,
      bookings:        totalBookings,
      activeBookings,
      pendingVehicles,
      revenue:         revenueResult[0]?.total ?? 0,
      revenueThisMonth: monthlyRevenueResult[0]?.total ?? 0,
    },
    bookingsByStatus: Object.fromEntries(
      bookingsByStatus.map((b: { _id: string; count: number }) => [b._id, b.count]),
    ),
    vehiclesByCategory: Object.fromEntries(
      vehiclesByCategory.map((v: { _id: string; count: number }) => [v._id, v.count]),
    ),
    recentBookings,
  };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function listUsers(query: {
  page: number; limit: number; role?: string;
  verified?: string; search?: string; order: "asc" | "desc";
}) {
  const { page, limit, role, verified, search, order } = query;
  const filter: Record<string, unknown> = {};

  if (role)     filter.role          = role;
  if (verified) filter.emailVerified = verified === "true";
  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ name: re }, { email: re }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("-passwordHash -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil")
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return paginate(items, total, page, limit);
}

export async function getUser(userId: string) {
  const user = await User.findById(userId)
    .select("-passwordHash -passwordResetToken -passwordResetExpires")
    .lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function updateUserRole(userId: string, role: "user" | "admin" | "seller") {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true })
    .select("-passwordHash")
    .lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function banUser(userId: string) {
  const user = await User.findByIdAndUpdate(userId, { isBanned: true }, { new: true })
    .select("-passwordHash -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil")
    .lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function unbanUser(userId: string) {
  const user = await User.findByIdAndUpdate(userId, { isBanned: false }, { new: true })
    .select("-passwordHash -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil")
    .lean();
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function deleteUser(userId: string, requestingAdminId: string) {
  if (userId === requestingAdminId) throw new AppError("Cannot delete your own account", 400);
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  await Booking.updateMany(
    { userId, status: { $in: ["pending", "confirmed"] } },
    { status: "cancelled" },
  );
  await user.deleteOne();
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export async function listAllVehicles(query: {
  page: number; limit: number; category?: string;
  status?: string; available?: string; search?: string; order: "asc" | "desc";
}) {
  const { page, limit, category, status, available, search, order } = query;
  const filter: Record<string, unknown> = {};

  if (category && category !== "All") filter.categories = category;
  if (status)    filter.status    = status;
  if (available) filter.available = available === "true";
  if (search)    filter.$text     = { $search: search };

  const [items, total] = await Promise.all([
    Vehicle.find(filter)
      .populate("sellerId", "name email")
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Vehicle.countDocuments(filter),
  ]);

  return paginate(items, total, page, limit);
}

export async function updateVehicleStatus(vehicleId: string, status: VehicleStatus) {
  const vehicle = await Vehicle.findByIdAndUpdate(vehicleId, { status }, { new: true }).lean();
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  return vehicle;
}

export async function deleteVehicle(vehicleId: string) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new AppError("Vehicle not found", 404);
  const activeBooking = await Booking.findOne({
    vehicleId,
    status: { $in: ["confirmed", "active"] },
  });
  if (activeBooking) throw new AppError("Cannot delete a vehicle with active bookings", 409);
  await vehicle.deleteOne();
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function listAllBookings(query: {
  page: number; limit: number; status?: string;
  vehicleId?: string; userId?: string; order: "asc" | "desc";
}) {
  const { page, limit, status, vehicleId, userId, order } = query;
  const filter: Record<string, unknown> = {};

  if (status)    filter.status    = status;
  if (vehicleId) filter.vehicleId = new mongoose.Types.ObjectId(vehicleId);
  if (userId)    filter.userId    = new mongoose.Types.ObjectId(userId);

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate("userId",    "name email")
      .populate("vehicleId", "name brand emoji")
      .sort({ createdAt: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return paginate(items, total, page, limit);
}

export async function updateBookingStatus(
  bookingId: string,
  status: "confirmed" | "active" | "completed" | "cancelled",
) {
  const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true })
    .populate("userId",    "name email")
    .populate("vehicleId", "name brand emoji")
    .lean();
  if (!booking) throw new AppError("Booking not found", 404);
  return booking;
}
