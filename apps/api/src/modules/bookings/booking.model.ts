import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  vehicle: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
