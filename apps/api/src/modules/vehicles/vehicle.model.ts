import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  name: string;
  type: "car" | "bike";
  brand: string;
  description: string;
  image: string;
  pricePerDay: number;
  seats?: number;
  transmission?: "manual" | "automatic";
  fuelType?: "petrol" | "diesel" | "electric";
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["car", "bike"], required: true },
    brand: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    pricePerDay: { type: Number, required: true },
    seats: { type: Number },
    transmission: { type: String, enum: ["manual", "automatic"] },
    fuelType: { type: String, enum: ["petrol", "diesel", "electric"] },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", vehicleSchema);
