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
export const insertUpdateItem = async (req, res) => {
  const { companyID } = req.user;
  const {
    itemID,
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

  /* ---- INSERT ---- */
  if (!itemID) {
    const item = await Item.create({
      companyID,
      itemName: itemName.trim(),
      description,
      saleRate,
      discountPct,
    });

    return res.json({
      itemID: item._id,
      updatedOn: item.updatedOn,
    });
  }

  /* ---- UPDATE ---- */
  const existing = await Item.findOne({ _id: itemID, companyID });

  if (!existing) {
    return res.status(404).json({ error: "Item not found" });
  }

  /* 🔥 Concurrency check */
  if (
    updatedOnPrev &&
    new Date(updatedOnPrev).getTime() !==
      new Date(existing.updatedOn).getTime()
  ) {
    return res
      .status(412)
      .json({ error: "Concurrency conflict. Reload data." });
  }

  existing.itemName = itemName.trim();
  existing.description = description;
  existing.saleRate = saleRate;
  existing.discountPct = discountPct;

  await existing.save();

  res.json({
    itemID: existing._id,
    updatedOn: existing.updatedOn,
  });
};

/* ---------------- DELETE ---------------- */
export const deleteItem = async (req, res) => {
  const { companyID } = req.user;
  const { itemID } = req.body;

  const deleted = await Item.findOneAndDelete({
    _id: itemID,
    companyID,
  });

  if (!deleted) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.json({ ok: true });
};
