import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requiredRole } from "../middleware/requireRole.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.post("/", auth, requiredRole("customer"), createOrder);

export default router;
