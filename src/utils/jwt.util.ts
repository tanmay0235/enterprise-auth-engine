import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as SignOptions;

  return jwt.sign({ userId }, secret, options);
};
