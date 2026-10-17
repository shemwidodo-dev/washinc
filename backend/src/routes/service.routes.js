import { Router } from "express";
import { getAllServices } from "../controllers/service.controller.js";

const router = Router();

router.get("/", getAllServices);

export default router;
