import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long")
      .regex(/^[a-zA-Z0-9\s\-'._]+$/, "Name contains invalid characters")
      .trim(),
    email: z.string().email("Invalid email format").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(1, "Password cannot be empty"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z
      .string()
      .length(6, "Code must be exactly 6 digits")
      .regex(/^\d{6}$/, "Code must be 6 digits"),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    credential: z.string().min(1, "Credential cannot be empty"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").trim().toLowerCase(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1).max(128),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
});

export function validate(schema: z.ZodTypeAny) {
  return (req: any, _res: any, next: any) => {
    try {
      schema.parse({ body: req.body });
      next();
    } catch (error) {
      next(error);
    }
  };
}
