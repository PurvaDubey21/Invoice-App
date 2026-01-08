import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getItemList,
  getItemLookupList,
  insertUpdateItem,
  deleteItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/getlist", authMiddleware, getItemList);
router.get("/getlookuplist", authMiddleware, getItemLookupList);
router.post("/", authMiddleware, insertUpdateItem);
router.post("/", authMiddleware, deleteItem);

export default router;
