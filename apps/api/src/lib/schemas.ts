import { z } from "zod";

// ─── Reusable primitives ──────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(255, "Email too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name too long");

export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort:  z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// ─── Auth schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name:     nameSchema,
  email:    emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email:    emailSchema,
  password: z.string().min(1, "Password is required").max(128),
});

export const googleSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1, "Reset token is required"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword:     passwordSchema,
}).refine(
  (d) => d.currentPassword !== d.newPassword,
  { message: "New password must differ from current", path: ["newPassword"] },
);

// ─── Vehicle schemas ──────────────────────────────────────────────────────────

export const createVehicleSchema = z.object({
  name:         z.string().trim().min(1).max(100),
  brand:        z.string().trim().min(1).max(100),
  type:         z.string().trim().min(1).max(100),
  emoji:        z.string().min(1).max(10),
  pricePerDay:  z.number().positive("Price must be positive"),
  tag:          z.string().trim().max(50).optional(),
  fuel:         z.enum(["Petrol", "Diesel", "Electric", "Hybrid"]),
  seats:        z.number().int().min(1).max(20),
  cc:           z.string().trim().max(20).optional(),
  transmission: z.enum(["Auto", "Manual"]),
  categories:   z.array(z.enum(["Cars", "Bikes", "Luxury", "SUV"])).min(1),
  description:  z.string().trim().min(10).max(500),
  images:       z.array(z.string()).max(10).default([]),
  available:    z.boolean().default(true),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleQuerySchema = z.object({
  ...paginationSchema.shape,
  category:    z.enum(["All", "Cars", "Bikes", "Luxury", "SUV"]).optional(),
  available:   z.enum(["true", "false"]).optional(),
  minPrice:    z.coerce.number().min(0).optional(),
  maxPrice:    z.coerce.number().min(0).optional(),
  search:      z.string().trim().max(100).optional(),
});

// ─── Booking schemas ──────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  vehicleId: objectIdSchema,
  startDate: z.coerce.date().refine(
    (d) => d >= new Date(new Date().setHours(0, 0, 0, 0)),
    "Start date cannot be in the past",
  ),
  endDate: z.coerce.date(),
}).refine(
  (d) => d.endDate > d.startDate,
  { message: "End date must be after start date", path: ["endDate"] },
);

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "active", "completed", "cancelled"]),
});

export const bookingQuerySchema = z.object({
  ...paginationSchema.shape,
  status:    z.enum(["pending", "confirmed", "active", "completed", "cancelled"]).optional(),
  vehicleId: objectIdSchema.optional(),
  userId:    objectIdSchema.optional(),
  from:      z.coerce.date().optional(),
  to:        z.coerce.date().optional(),
});

// ─── Admin user schemas ───────────────────────────────────────────────────────

export const updateUserRoleSchema = z.object({
  role: z.enum(["user", "admin", "seller"]),
});

export const adminUserQuerySchema = z.object({
  ...paginationSchema.shape,
  role:     z.enum(["user", "admin"]).optional(),
  verified: z.enum(["true", "false"]).optional(),
  search:   z.string().trim().max(100).optional(),
});
