import { Request, Response } from "express";
import authService from "../services/auth.service";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await authService.registerUser(
      req.body.name,
      req.body.email,
      req.body.password,
    );
    const { password, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.loginUser(req.body.email, req.body.password);
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    // Store the refresh token in the database
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();
    const { password, refreshTokens, ...userWithoutPrivateData } =
      user.toObject();
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: userWithoutPrivateData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};
const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized: User ID missing from request",
      });
      return;
    }
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const refreshAuthToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({
        status: "fail",
        message: "Refresh token is required",
      });
      return;
    }
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
      throw new Error("REFRESH_TOKEN_SECRET is missing");
    }
    const decoded = jwt.verify(refreshToken, secret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      res.status(401).json({
        status: "fail",
        message: "Invalid refresh token",
      });
      return;
    }
    const newAccessToken = generateAccessToken(user._id.toString());
    res.status(200).json({
      status: "success",
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
};

export { registerUser, loginUser, getProfile, refreshAuthToken };
