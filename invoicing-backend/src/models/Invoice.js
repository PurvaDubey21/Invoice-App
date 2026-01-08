import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
{
    invoiceNo: { type: Number, required: true },
    invoiceDate: { type: Date, required: true },
    customerName: { type: String, required: true },

    subTotal: { type: Number, required: true },
    taxPercentage: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    invoiceAmount: { type: Number, required: true },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
},
},
{
    timestamps: true,
}
);

export default mongoose.model("Invoice", invoiceSchema);