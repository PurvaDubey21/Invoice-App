import express from "express";
import {
  signup,
  login,
  getCompanyLogoUrl,
  me,
  logout,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// AUTH
router.post("/Signup", upload.single("logo"), signup);
router.post("/Login", login);

// SESSION
router.get("/Me", authMiddleware, me);
router.post("/Logout", authMiddleware, logout);

// COMPANY
router.get("/CompanyLogo/:id", getCompanyLogoUrl);

export default router;
