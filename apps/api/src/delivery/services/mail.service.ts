import { Resend } from "resend";
import { env } from "../../config";

let resend: Resend | null = null;
if (env.RESEND_API_KEY && env.RESEND_API_KEY !== "your_resend_api_key") {
  resend = new Resend(env.RESEND_API_KEY);
}

export const mailService = {
  async sendVerificationEmail(email: string, name: string, token: string) {
    if (!resend) {
      console.log(`[MOCK EMAIL] to: ${email} | Name: ${name} | OTP: ${token}`);
      return true;
    }

    const { error } = await resend.emails.send({
      from: env.MAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Hello ${name},\n\nYour verification code is: ${token}\n\nEnter this code to verify your account.\n\nThis code expires in 1 hour.`,
      html: `<p>Hello ${name},</p><p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;color:#E11D48">${token}</p><p>Enter this code to verify your account.</p><p>This code expires in 1 hour.</p>`,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("ERR_EMAIL_SEND_FAILED");
    }

    console.log(`Verification email sent to ${email}`);
  },

  async sendPasswordResetEmail(email: string, token: string) {
    if (!resend) {
      console.log(`[MOCK EMAIL] Password reset to: ${email} | OTP: ${token}`);
      return true;
    }

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const { error } = await resend.emails.send({
      from: env.MAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      text: `Hello,\n\nPlease reset your password by clicking the link below:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Hello,</p><p>Please reset your password by clicking the link below:</p><p><a href="${resetLink}">Reset Password</a></p><p>If you did not request this, please ignore this email.</p>`,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("ERR_EMAIL_SEND_FAILED");
    }
  },
};
