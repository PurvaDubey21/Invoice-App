/* =========================================================
   Invoice Types – PRD Aligned
   Used by:
   - InvoiceEditor.tsx
   - InvoiceDetails.tsx
   - InvoiceLineItems.tsx
   - InvoiceTotals.tsx
   - invoiceApi.ts
========================================================= */


/* ----------------------------------
   Invoice Header (Editor State)
---------------------------------- */
export interface InvoiceHeader {
  invoiceID?: number;          // present in edit mode
  invoiceNo?: number | "";
  invoiceDate: string;         // yyyy-mm-dd
  customerName: string;
  address: string;
  city: string;
  notes: string;

  taxPct: number;              // 0–100
  taxAmt: number;              // >= 0

  updatedOn?: string;          // concurrency control
}

/* ----------------------------------
   Invoice Line (Editor State)
---------------------------------- */
export interface InvoiceLine {
  rowId: string;               // frontend only
  itemID: number | null;             // mandatory before save
  description: string;
  qty: number;                 // >= 0
  rate: number;                // >= 0
  discountPct: number;         // 0–100
  amount: number;  
  isRateEdited?: boolean;
  isDiscountEdited?: boolean;            // calculated (RO)
}

/* ----------------------------------
   Invoice Editor State
---------------------------------- */
export interface InvoiceEditorState {
  header: InvoiceHeader;
  lines: InvoiceLine[];
}

/* ----------------------------------
   Derived Totals (Frontend Only)
---------------------------------- */
export interface InvoiceTotals {
  subTotal: number;                  // sum of line.amount
  taxPct: number;
  taxAmt: number;
  invoiceAmount: number;             // subTotal + taxAmt
}

/* ----------------------------------
   Validation Errors (Phase 5)
---------------------------------- */
export interface InvoiceHeaderErrors {
   invoiceNo?: string;
  invoiceDate?: string;
  customerName?: string;
  notes?: string;
}

export interface InvoiceLineErrors {
  itemID?: string;
  qty?: string;
  rate?: string;
  discountPct?: string;
}

/* ----------------------------------
   API Payload – Save Invoice
---------------------------------- */
export interface SaveInvoicePayload {
  invoiceID?: number;
  invoiceNo?: number;
  invoiceDate: string;
  customerName: string;
  address?: string | null;
  city?: string | null;
  notes?: string | null;

  taxPercentage: number;

  updatedOnPrev?: string | null;

  lines: {
    rowNo: number;
    itemID?: number;
    description: string;
    quantity: number;
    rate: number;
    discountPct: number;
  }[];
}

/* ----------------------------------
   API Response – Invoice (Edit Load)
---------------------------------- */
export interface InvoiceApiResponse {
  invoiceID: number;
  invoiceNo: number;
  invoiceDate: string;
  customerName: string;
  address?: string;
  city?: string;
  notes?: string;

  taxPercentage: number;   // ✅ backend field
  taxAmount: number;       // ✅ backend field


  updatedOn: string;

  lines: {
    rowNo: number;
    itemID: number;
    description?: string;
    quantity: number;
    rate: number;
    discountPct: number;
  }[];
}

/* ----------------------------------
   Item Lookup (Dropdown)
   (Aligned with Item/GetLookupList)
---------------------------------- */
export interface ItemLookup {
  itemID: number,
  itemName: string
}


/* ----------------------------------
   Utility Types
---------------------------------- */
export type InvoiceMode = "new" | "edit";

export interface SaveInvoiceResponse {
  invoiceID: number;
  updatedOn: string;
}
