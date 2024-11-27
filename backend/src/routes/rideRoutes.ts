// src/routes/rideRoutes.ts

import { Router } from "express";
import {
  confirmRide,
  estimateRide,
  getRides,
} from "../controllers/rideController";

const router = Router();

router.post("/ride/estimate", estimateRide);
router.patch("/ride/confirm", confirmRide);
router.get("/ride/:customer_id", getRides);
export default router;
