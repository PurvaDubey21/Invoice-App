// invoice/validators/invoiceDetails.validators.ts
import type { InvoiceHeader, InvoiceHeaderErrors } from "../types/invoiceEditor.types";

export function validateInvoiceDetails(
  header: InvoiceHeader
): InvoiceHeaderErrors {
  const errors: InvoiceHeaderErrors = {};

  // Invoice Date (required)
  if (!header.invoiceDate) {
    errors.invoiceDate = "Pick a date.";
  }

  // Customer Name (required)
  if (!header.customerName.trim()) {
    errors.customerName = "Enter name.";
  }

  // Notes length
  if (header.notes && header.notes.length > 500) {
    errors.notes = "Max 500 characters allowed.";
  }

  return errors;
}
