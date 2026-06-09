import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { User } from "./user.model";
import { addMailJob } from "../../delivery/queues/mail.queue";
import { config } from "../../config";

const googleClient = config.googleClientId
  ? new OAuth2Client(config.googleClientId)
  : null;

export class AuthService {
  async register(data: { name: string; email: string; password: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("USER_ALREADY_EXISTS");

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const verificationToken = String(crypto.randomInt(100000, 999999));
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: new Date(Date.now() + 3600000),
    });

    try {
      await addMailJob({
        type: "verification",
        email: user.email,
        name: user.name,
        token: verificationToken,
      });
    } catch (err) {
      console.error("Failed to queue email:", (err as Error).message);
    }

    return { id: user._id.toString(), name: user.name, email: user.email, otp: verificationToken };
  }

  async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    if (!user) throw new Error("INVALID_CREDENTIALS");

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error("ACCOUNT_LOCKED");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      await this._incrementAttempts(user._id.toString());
      throw new Error("INVALID_CREDENTIALS");
    }

    await User.findByIdAndUpdate(user._id, { $set: { loginAttempts: 0, lockUntil: null } });

    if (!user.isVerified) throw new Error("EMAIL_NOT_VERIFIED");

    return { id: user._id.toString(), name: user.name, email: user.email };
  }

  async googleLogin(credential: string) {
    if (!googleClient) throw new Error("Google OAuth is not configured");

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload()!;
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await User.create({
        name: name || email!.split("@")[0],
        email,
        password: hashedPassword,
        isVerified: true,
        googleId,
        picture,
      });
    }

    if (!user.isVerified) {
      await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true, verificationToken: null, verificationTokenExpires: null },
      });
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture || picture,
    };
  }

  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) throw new Error("INVALID_OR_EXPIRED_VERIFICATION_TOKEN");

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      throw new Error("INVALID_OR_EXPIRED_VERIFICATION_TOKEN");
    }

    await User.findByIdAndUpdate(user._id, {
      $set: { isVerified: true, verificationToken: null, verificationTokenExpires: null },
    });

    return { message: "Email verified successfully" };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return { message: "If that email exists, a reset link has been sent." };

    const resetToken = String(crypto.randomInt(100000, 999999));
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await User.findByIdAndUpdate(user._id, {
      $set: {
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + 3600000),
      },
    });

    try {
      await addMailJob({
        type: "password-reset",
        email: user.email,
        name: user.name,
        token: resetToken,
      });
    } catch (err) {
      console.error("Failed to queue password reset email:", (err as Error).message);
    }

    return { message: "If that email exists, a reset link has been sent." };
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken });

    if (!user) throw new Error("INVALID_OR_EXPIRED_RESET_TOKEN");

    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
      throw new Error("INVALID_OR_EXPIRED_RESET_TOKEN");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(user._id, {
      $set: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: "Password reset successfully" };
  }

  private async _incrementAttempts(userId: string) {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION = 30 * 60 * 1000;

    const updated = await User.findByIdAndUpdate(
      userId,
      { $inc: { loginAttempts: 1 } },
      { new: true }
    );

    if (updated && updated.loginAttempts >= MAX_ATTEMPTS) {
      await User.findByIdAndUpdate(userId, {
        $set: { lockUntil: new Date(Date.now() + LOCK_DURATION) },
      });
    }
  }
}
