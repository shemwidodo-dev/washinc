import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requiredRole } from "../middleware/requireRole.js";
import {
  createOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/", auth, requiredRole("customer"), createOrder);
router.patch(
  "/:id/status",
  auth,
  requiredRole("admin", "boss", "superadmin"),
  updateOrderStatus,
);
export default router;
