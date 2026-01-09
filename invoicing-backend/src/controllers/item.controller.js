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
  const { companyID } = req.user;
  const { itemName, description, saleRate, discountPct } = req.body;

  /* ---- validations ---- */
  if (!itemName || itemName.length > 50) {
    return res.status(400).json({ error: "Invalid item name" });
  }
  if (saleRate < 0) {
    return res.status(400).json({ error: "Sale rate must be ≥ 0" });
  }
  if (discountPct < 0 || discountPct > 100) {
    return res.status(400).json({ error: "Discount must be 0–100" });
  }

  /* ---- insert ---- */
  const item = await Item.create({
    companyID,
    itemName: itemName.trim(),
    description,
    saleRate,
    discountPct,
  });

  return res.status(201).json({
    itemID: item._id,
    updatedOn: item.updatedOn,
  });
};

export const updateItem = async (req, res) => {
  const { companyID } = req.user;
  const { id } = req.params;
  const {
    itemName,
    description,
    saleRate,
    discountPct,
    updatedOnPrev,
  } = req.body;

  /* ---- validations ---- */
  if (!itemName || itemName.length > 50) {
    return res.status(400).json({ error: "Invalid item name" });
  }
  if (saleRate < 0) {
    return res.status(400).json({ error: "Sale rate must be ≥ 0" });
  }
  if (discountPct < 0 || discountPct > 100) {
    return res.status(400).json({ error: "Discount must be 0–100" });
  }

  /* ---- find ---- */
  const item = await Item.findOne({ _id: id, companyID });
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  /* ---- concurrency check ---- */
  if (
    updatedOnPrev &&
    new Date(updatedOnPrev).getTime() !==
      new Date(item.updatedOn).getTime()
  ) {
    return res
      .status(412)
      .json({ error: "Concurrency conflict. Reload data." });
  }

  /* ---- update ---- */
  item.itemName = itemName.trim();
  item.description = description;
  item.saleRate = saleRate;
  item.discountPct = discountPct;

  await item.save();

  res.json({
    itemID: item._id,
    updatedOn: item.updatedOn,
  });
};



/* ---------------- DELETE ---------------- */
export const deleteItem = async (req, res) => {
  const { companyID } = req.user;
  const { id } = req.params;

  const deleted = await Item.findOneAndDelete({
    _id: id,
    companyID,
  });

  if (!deleted) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ ok: true , message: "Item deleted" });
};

/* ================= UPLOAD / UPDATE PICTURE ================= */
export const updateItemPicture = async (req, res) => {
 try{ const { companyID } = req.user;
  const { id } = req.params;
  console.log("PARAM ID:", req.params.id);
console.log("COMPANY:", req.user.companyID);
console.log("TYPEOF token companyID:", typeof req.user.companyID);
console.log("FILE:", req.file?.filename);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }


  const item = await Item.findOne({ _id: id, companyID });
  if (!item) return res.status(404).json({ error: "Item not found" });

  item.pictureUrl = `/uploads/items/${req.file.filename}`;
  await item.save();

  res.json({ url: item.pictureUrl });
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
  // for now same image (can add sharp later)
  return getItemPicture(req, res);
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
