import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ vehicleId: 1, status: 1 });
bookingSchema.index({ userId: 1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);
