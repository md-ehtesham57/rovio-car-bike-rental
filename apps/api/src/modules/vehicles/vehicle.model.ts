import mongoose, { Document, Schema } from "mongoose";

export type VehicleCategory = "Cars" | "Bikes" | "Luxury" | "SUV";
export type FuelType        = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type TransmissionType = "Auto" | "Manual";
export type VehicleStatus   = "active" | "inactive" | "pending_review";

export interface IVehicle extends Document {
  _id:          mongoose.Types.ObjectId;
  sellerId:     mongoose.Types.ObjectId;   // owner (user with role seller/admin)
  name:         string;
  brand:        string;
  type:         string;
  emoji:        string;
  pricePerDay:  number;
  tag?:         string;
  fuel:         FuelType;
  seats:        number;
  cc?:          string;
  transmission: TransmissionType;
  categories:   VehicleCategory[];
  description:  string;
  images:       string[];
  status:       VehicleStatus;
  available:    boolean;
  location?:    string;
  createdAt:    Date;
  updatedAt:    Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    sellerId:     { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name:         { type: String, required: true, trim: true, maxlength: 100 },
    brand:        { type: String, required: true, trim: true, maxlength: 100 },
    type:         { type: String, required: true, trim: true },
    emoji:        { type: String, required: true, maxlength: 10 },
    pricePerDay:  { type: Number, required: true, min: 0 },
    tag:          { type: String, trim: true, maxlength: 50 },
    fuel:         { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true },
    seats:        { type: Number, required: true, min: 1, max: 20 },
    cc:           { type: String, trim: true, maxlength: 20 },
    transmission: { type: String, enum: ["Auto", "Manual"], required: true },
    categories:   [{ type: String, enum: ["Cars", "Bikes", "Luxury", "SUV"] }],
    description:  { type: String, required: true, trim: true, maxlength: 500 },
    images:       [{ type: String }],
    status:       { type: String, enum: ["active", "inactive", "pending_review"], default: "pending_review" },
    available:    { type: Boolean, default: true },
    location:     { type: String, trim: true, maxlength: 100 },
  },
  { timestamps: true },
);

VehicleSchema.index({ sellerId: 1 });
VehicleSchema.index({ categories: 1 });
VehicleSchema.index({ available: 1, status: 1 });
VehicleSchema.index({ pricePerDay: 1 });
VehicleSchema.index({ name: "text", brand: "text", description: "text" });

export const Vehicle = mongoose.model<IVehicle>("Vehicle", VehicleSchema);