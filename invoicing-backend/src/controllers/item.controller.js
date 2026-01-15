import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { Item } from "../models/Item.model.js";

/* ---------------- GET LIST ---------------- */
export const getItemList = async (req, res) => {
  const { companyID } = req.user;
  const { itemID } = req.query;

  const query = { companyID };
  if (itemID) query._id = itemID;

  const items = await Item.find(query).sort({ createdOn: -1 });

  res.json(items);
};
/* ================= GET BY ID (MODAL) ================= */
export const getItemById = async (req, res) => {
  const { companyID } = req.user;
  const { id } = req.params;

  const item = await Item.findOne({ _id: id, companyID });
  if (!item) return res.status(404).json({ error: "Item not found" });

  res.json(item);
};

/* ---------------- LOOKUP LIST ---------------- */
export const getItemLookupList = async (req, res) => {
  const { companyID } = req.user;

  const items = await Item.find(
    { companyID },
    { itemName: 1, saleRate: 1, discountPct: 1 }
  );

  res.json(items);
};

/* ---------------- INSERT / UPDATE ---------------- */
export const insertItem = async (req, res) => {
  try {
    /* ---------- AUTH ---------- */
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { companyID } = req.user;
    const { itemName, description, saleRate, discountPct } = req.body;

    /* ---------- VALIDATIONS ---------- */
    if (!itemName || itemName.trim().length === 0 || itemName.length > 50) {
      return res.status(400).json({ error: "Invalid item name" });
    }

    const rate = Number(saleRate);
    const discount = Number(discountPct);

    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ error: "Sale rate must be ≥ 0" });
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ error: "Discount must be 0–100" });
    }

    /* ---------- INSERT ---------- */
    const item = await Item.create({
      companyID,
      itemName: itemName.trim(),
      description: description?.trim() || "",
      saleRate: rate,
      discountPct: discount,
    });

    return res.status(201).json({
      itemID: item._id,
      updatedOn: item.updatedOn,
    });
  } catch (err) {
    console.error("INSERT ITEM ERROR:", err);

    // duplicate name (unique index)
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Item name already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};


export const updateItem = async (req, res) => {
  try {
    /* ---------- AUTH ---------- */
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { companyID } = req.user;
    const { id } = req.params;

    const {
      itemName,
      description,
      saleRate,
      discountPct,
      updatedOnPrev,
      removeImage,
    } = req.body;

    /* ---------- VALIDATIONS ---------- */
    if (!itemName || itemName.trim().length === 0 || itemName.length > 50) {
      return res.status(400).json({ error: "Invalid item name" });
    }

    const rate = Number(saleRate);
    const discount = Number(discountPct);

    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ error: "Sale rate must be ≥ 0" });
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ error: "Discount must be 0–100" });
    }

    /* ---------- FIND ---------- */
    const item = await Item.findOne({ _id: id, companyID });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    /* ---------- CONCURRENCY CHECK ---------- */
    if (
      updatedOnPrev &&
      new Date(updatedOnPrev).getTime() !==
        new Date(item.updatedOn).getTime()
    ) {
      return res
        .status(412)
        .json({ error: "Concurrency conflict. Reload data." });
    }

    /* ---------- IMAGE REMOVE ---------- */
    if (removeImage === true) {
      const safeDelete = (fileUrl) => {
        try {
          if (!fileUrl) return;

          const cleanPath = fileUrl.replace(/^\//, "");
          const filePath = path.join(process.cwd(), cleanPath);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error("Image delete failed:", err);
        }
      };

      safeDelete(item.pictureUrl);
      safeDelete(item.thumbnailUrl);

      item.pictureUrl = null;
      item.thumbnailUrl = null;
    }

    /* ---------- UPDATE ---------- */
    item.itemName = itemName.trim();
    item.description = description?.trim() || "";
    item.saleRate = rate;
    item.discountPct = discount;

    await item.save();

    return res.json({
      itemID: item._id,
      updatedOn: item.updatedOn,
    });
  } catch (err) {
    console.error("UPDATE ITEM ERROR:", err);

    // duplicate name (unique index)
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Item name already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};



/* ---------------- DELETE ---------------- */
export const deleteItem = async (req, res) => {
  try {
    /* ---------- AUTH ---------- */
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { companyID } = req.user;
    const { id } = req.params;

    /* ---------- VALID ID ---------- */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item id" });
    }

    /* ---------- FIND ---------- */
    const item = await Item.findOne({ _id: id, companyID });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    /* ---------- IMAGE CLEANUP (OPTIONAL BUT GOOD) ---------- */
    const safeDelete = (fileUrl) => {
      try {
        if (!fileUrl) return;

        const cleanPath = fileUrl.replace(/^\//, "");
        const filePath = path.join(process.cwd(), cleanPath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Image delete failed:", err);
      }
    };

    safeDelete(item.pictureUrl);
    safeDelete(item.thumbnailUrl);

    /* ---------- DELETE ---------- */
    await item.deleteOne();

    return res.json({
      ok: true,
      message: "Item deleted",
    });
  } catch (err) {
    console.error("DELETE ITEM ERROR:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/* ================= UPLOAD / UPDATE PICTURE ================= */
export const updateItemPicture = async (req, res) => {
  try {
    const { companyID } = req.user;
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const item = await Item.findOne({ _id: id, companyID });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    /* ---------- ACTUAL FILE PATH ---------- */
    const originalPath = req.file.path;
    const originalFilename = path.basename(originalPath);

    const thumbPath = originalPath.replace(
      path.extname(originalPath),
      "_thumb.png"
    );
    const thumbFilename = path.basename(thumbPath);

    /* ---------- GENERATE THUMBNAIL ---------- */
    await sharp(originalPath)
      .resize(150, 150, { fit: "inside" })
      .png()
      .toFile(thumbPath);

    /* ---------- SAFE DELETE OLD FILES ---------- */
    const safeDelete = (fileUrl) => {
      if (!fileUrl) return;
      const filePath = path.join(
        process.cwd(),
        fileUrl.replace(/^\//, "")
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    safeDelete(item.pictureUrl);
    safeDelete(item.thumbnailUrl);

    /* ---------- SAVE NEW URLS ---------- */
    item.pictureUrl = `/uploads/items/${originalFilename}`;
    item.thumbnailUrl = `/uploads/items/${thumbFilename}`;

    await item.save();

    res.json({
      url: item.pictureUrl,
      thumbUrl: item.thumbnailUrl,
    });
  } catch (err) {
    console.error("UpdateItemPicture error:", err);
    res.status(500).json({ error: "Failed to update item picture" });
  }
};


/* ================= GET PICTURE ================= */
export const getItemPicture = async (req, res) => {
  const { companyID } = req.user;
  const { id } = req.params;

  const item = await Item.findOne({ _id: id, companyID });
  if (!item || !item.pictureUrl)
    return res.status(404).json({ error: "Picture not found" });

  res.json({ url: item.pictureUrl });

};

/* ================= GET THUMBNAIL ================= */
export const getItemPictureThumbnail = async (req, res) => {
  try {
    const { companyID } = req.user;
    const { id } = req.params;

    const item = await Item.findOne({ _id: id, companyID });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    /* ---------- THUMBNAIL PATH ---------- */
    if (item.thumbnailUrl) {
      const thumbPath = path.join(
        process.cwd(),
        item.thumbnailUrl
      );

      if (fs.existsSync(thumbPath)) {
        return res.sendFile(thumbPath);
      }
    }

    /* ---------- FALLBACK TO ORIGINAL ---------- */
    if (item.pictureUrl) {
      const originalPath = path.join(
        process.cwd(),
        item.pictureUrl
      );

      if (fs.existsSync(originalPath)) {
        return res.sendFile(originalPath);
      }
    }

    return res.status(404).json({ error: "Picture not found" });
  } catch (err) {
    console.error("GetItemPictureThumbnail error:", err);
    res
      .status(500)
      .json({ error: "Failed to load thumbnail" });
  }
};

/* ================= CHECK DUPLICATE NAME ================= */
export const checkDuplicateItemName = async (req, res) => {
  try {
    const { companyID } = req.user;
    const { ItemName, ExcludeID } = req.query;

    if (!ItemName) {
      return res.status(400).json({ error: "ItemName is required" });
    }

    const query = {
      companyID,
      itemName: ItemName.trim(),
    };

    if (ExcludeID) {
      query._id = { $ne: ExcludeID };
    }

    const exists = await Item.findOne(query);

    res.json({ exists: !!exists });
  } catch (err) {
    console.error("CheckDuplicateItemName error:", err);
    res.status(500).json({ error: "Failed to check duplicate item name" });
  }
};
