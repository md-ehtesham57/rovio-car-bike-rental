import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  loginAttempts: number;
  lockUntil?: Date | null;
  googleId?: string | null;
  picture?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, index: true },
    verificationTokenExpires: { type: Date },
    passwordResetToken: { type: String, index: true },
    passwordResetExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    googleId: { type: String, index: true, sparse: true },
    picture: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
