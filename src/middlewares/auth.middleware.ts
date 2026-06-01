import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 1. Tell Express that req.userId is allowed
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// 2. Fix for Error 2: Create a strict blueprint for our decoded token
interface TokenPayload extends jwt.JwtPayload {
  userId: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ status: "fail", message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // 3. Fix for Error 1: Strict check to ensure the token didn't evaluate to undefined
    if (!token) {
      res
        .status(401)
        .json({ status: "fail", message: "Unauthorized: Malformed token" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");

    // We safely cast the result to our new TokenPayload interface
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(401)
      .json({ status: "fail", message: "Unauthorized: Invalid token" });
  }
};
