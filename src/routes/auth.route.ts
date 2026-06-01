import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers";
import { registerSchema } from "../schemas/auth.schema";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
export default router;
