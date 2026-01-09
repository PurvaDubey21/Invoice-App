import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  getItemList,
  getItemById,
  getItemLookupList,
  insertItem,
  updateItem,
  deleteItem,
  updateItemPicture,
  getItemPicture,
  getItemPictureThumbnail,
  checkDuplicateItemName,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/getlist", authMiddleware, getItemList);
router.get("/CheckDuplicateItemName", authMiddleware, checkDuplicateItemName);
router.post(
  "/UpdateItemPicture/:id", 
  authMiddleware, 
  upload.single("file"),
  updateItemPicture
);

router.get("/Picture/:id", authMiddleware,getItemPicture);

router.get("/PictureThumbnail/:id", authMiddleware, getItemPictureThumbnail);
router.get("/GetLookupList", authMiddleware, getItemLookupList);
router.post("/", authMiddleware, insertItem);
router.put("/:id", authMiddleware, updateItem);

router.delete("/:id", authMiddleware, deleteItem);

router.get("/:id", authMiddleware, getItemById);



export default router;
