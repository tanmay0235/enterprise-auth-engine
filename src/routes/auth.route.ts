import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers";
import { registerSchema } from "../schemas/auth.schema";
import { validate } from "../middlewares/validate.middleware";
import { loginUser } from "../controllers/auth.controllers";
import { loginSchema } from "../schemas/auth.schema";
import { getProfile } from "../controllers/auth.controllers";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/profile", requireAuth, getProfile);

export default router;
