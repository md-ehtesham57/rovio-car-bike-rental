import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  googleId?: string;
  picture?: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  loginAttempts: number;
  lockUntil?: Date | null;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true, maxlength: 100 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true },
    googleId:     { type: String, sparse: true },
    picture:      { type: String },
    role:         { type: String, enum: ["user", "admin"], default: "user" },
    isVerified:   { type: Boolean, default: false },
    verificationToken:   { type: String },
    verificationTokenExpires: { type: Date },
    passwordResetToken:   { type: String },
    passwordResetExpires: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date },
    lastLoginAt:   { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });

export const User = mongoose.model<IUser>("User", UserSchema);
