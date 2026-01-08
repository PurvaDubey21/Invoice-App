import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ===== USER INFO =====
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true, // 🔐 hashed password
    },

    // ===== COMPANY INFO =====
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    zip: {
      type: String,
      required: true,
      match: [/^\d{6}$/, "Zip must be exactly 6 digits"],
    },

    industry: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },

    currencySymbol: {
      type: String,
      required: true,
      maxlength: 5,
    },

    // ===== LOGO =====
    logoUrl: {
      type: String, // file path / cloud URL
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("User", userSchema);
