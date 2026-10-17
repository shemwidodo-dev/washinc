import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  login,
  getUserLogin,
  register,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", login);
router.get("/me", auth, getUserLogin);
router.post("/register", register);

export default router;
