import { Response } from "express";

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  picture?: string;
  jti?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      isApiRequest?: boolean;
    }
  }
}

export function sendSuccess(res: Response, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}
