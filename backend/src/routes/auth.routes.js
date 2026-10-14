import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { login, getUserLogin } from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", login);
router.get("/me", auth, getUserLogin);

export default router;
