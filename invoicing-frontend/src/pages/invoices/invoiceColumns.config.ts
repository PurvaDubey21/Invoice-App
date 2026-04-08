export const ALL_COLUMNS = [
 { key: "invoiceNo", label: "Invoice No" },
  { key: "invoiceDate", label: "Date" },
  { key: "customerName", label: "Customer" },
  { key: "totalItems", label: "Items" },
  { key: "subTotal", label: "Sub Total" },
  { key: "taxPercentage", label: "Tax %" },
  { key: "taxAmount", label: "Tax Amt" },
  { key: "invoiceAmount", label: "Total" },
] as const;

export type InvoiceColumnKey = typeof ALL_COLUMNS[number]["key"];
