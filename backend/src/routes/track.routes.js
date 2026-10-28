import { Router } from "express";
import { getTracking } from "../controllers/order.controller.js";

const router = Router();

router.get("/:trackingCode", getTracking);

export default router;
