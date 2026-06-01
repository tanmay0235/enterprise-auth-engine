import { Request, Response } from "express";
import authService from "../services/auth.service";
import { generateToken } from "../utils/jwt.util";
import { User } from "../models/user.model";

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
    const token = generateToken(user._id.toString());
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: userWithoutPassword,
      token,
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

export { registerUser, loginUser, getProfile };
