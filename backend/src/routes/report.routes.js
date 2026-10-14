import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requiredRole } from "../middleware/requireRole.js";
import { getAllSales } from "../controllers/report.controller.js";

const router = Router();

router.get("/sales", auth, requiredRole("boss", "superadmin"), getAllSales);

export default router;
