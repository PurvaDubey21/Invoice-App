import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    companyID: {
      type: Number,
      required: true,
      index: true,
    },

    itemName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 500,
      default: null,
    },

    saleRate: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    discountPct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    updatedOn: {
      type: Date,
      default: Date.now,
    },
    
     pictureUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: "createdOn", updatedAt: "updatedOn" } }
);

/* 🔥 UNIQUE per company */
itemSchema.index(
  { companyID: 1, itemName: 1 },
  { unique: true }
);

export const Item = mongoose.model("Item", itemSchema);
