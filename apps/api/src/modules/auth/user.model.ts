import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "user" | "admin" | "seller";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  picture?: string;
  role: UserRole;
  emailVerified: boolean;
  isBanned: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isLocked(): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true, maxlength: 100 },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    googleId:     { type: String, sparse: true },
    picture:      { type: String },
    role:         { type: String, enum: ["user", "admin", "seller"], default: "user" },
    emailVerified:   { type: Boolean, default: false },
    isBanned:        { type: Boolean, default: false },
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil:     { type: Date, select: false },
    lastLoginAt:   { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ passwordResetToken: 1 }, { sparse: true });

UserSchema.methods.isLocked = function isLocked(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

export const User = mongoose.model<IUser>("User", UserSchema);
