import express from "express";
import {
  getList,
  getMetrices,
  getTrend12m,
  getTopItems,
} from "../controllers/invoice.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getlist", authMiddleware, getList);
router.get("/getmetrices", authMiddleware, getMetrices);
router.get("/gettrend12m", authMiddleware, getTrend12m);
router.get("/topitems", authMiddleware, getTopItems);

export default router;
