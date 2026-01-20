import type { InvoiceLine, InvoiceLineErrors } from "../types/invoiceEditor.types";

export function validateInvoiceLine(line: InvoiceLine): InvoiceLineErrors {
  const errors: InvoiceLineErrors = {};

  if (!line.itemID) {
    errors.itemID = "Pick an item.";
  }

  if (line.qty < 0) {
    errors.qty = "Qty must be ≥ 0.";
  }

  if (line.rate < 0) {
    errors.rate = "Rate must be ≥ 0.";
  }

  if (line.discountPct < 0 || line.discountPct > 100) {
    errors.discountPct = "Disc must be 0–100.";
  }

  return errors;
}
