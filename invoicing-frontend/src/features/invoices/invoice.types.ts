export interface Invoice {
  invoiceID: number;
  invoiceNo: number;
  invoiceDate: string;
  customerName: string;
  subTotal: number;
  taxPercentage: number;
  taxAmount: number;
  invoiceAmount: number;
}

export interface InvoiceMetrics {
  invoiceCount: number;
  totalAmount: number;
}

export interface InvoiceTrend {
  monthStart: string;
  invoiceCount: number;
  amountSum: number;
}

export interface TopItem {
  itemID: number | null;
  itemName: string;
  amountSum: number;
  // ✅ Recharts compatibility
  [key: string]: string | number | null;
}
