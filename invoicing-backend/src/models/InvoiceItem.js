import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  itemName: { type: String },
  quantity: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  amount: { type: Number, required: true },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
});

export default mongoose.model("InvoiceItem", invoiceItemSchema);
