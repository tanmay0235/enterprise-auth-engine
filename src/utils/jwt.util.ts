import jwt, { SignOptions } from "jsonwebtoken";

export const generateAccessToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as SignOptions;

  return jwt.sign({ userId }, secret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is missing");
  }
  const options = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  } as SignOptions;
  return jwt.sign({ userId }, secret, options);
};
