import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import {
  useGetInvoiceByIdQuery,
  useInsertInvoiceMutation,
  useUpdateInvoiceMutation,
} from "../../services/invoiceApi";
import type { InvoiceLineItemsRef } from "../../components/InvoiceEditor/InvoiceLineItems";

import InvoiceDetails from "../../components/InvoiceEditor/InvoiceDetails";
import InvoiceLineItems from "../../components/InvoiceEditor/InvoiceLineItems";
import InvoiceTotals from "../../components/InvoiceEditor/InvoiceTotals";
import { validateInvoiceDetails } from "../../utils/invoiceDetails.validators";
import { hasAtLeastOneValidLine } from "../../utils/invoiceLine.validators";

import type {
  InvoiceEditorState,
  InvoiceHeader,
  InvoiceLine,
  InvoiceHeaderErrors,
} from "../../types/invoiceEditor.types";

/* ----------------------------------
   Helpers 
---------------------------------- */
const createEmptyLine = (): InvoiceLine => ({
  rowId: crypto.randomUUID(),
  itemID: null, // ✅ ADD THIS
  description: "",
  qty: 1,
  rate: 0,
  discountPct: 0,
  amount: 0,
});

const InvoiceEditor: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isInitializedRef = useRef(false);
  const lineItemsRef = useRef<InvoiceLineItemsRef>(null);

  const invoiceIDParam = params.get("id");
  const invoiceID = invoiceIDParam ? Number(invoiceIDParam) : null;
  const [headerErrors, setHeaderErrors] = useState<InvoiceHeaderErrors>({});

  /* ----------------------------------
     API
  ---------------------------------- */
  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetInvoiceByIdQuery(invoiceID as number, {
    skip: invoiceID === null,
  });

  console.log("URL param invoiceID:", invoiceID);
console.log("invoiceData:", invoiceData);

  const [insertInvoice, { isLoading: isSavingInsert }] =
    useInsertInvoiceMutation();

  const [updateInvoice, { isLoading: isSavingUpdate }] =
    useUpdateInvoiceMutation();

  const isSaving = isSavingInsert || isSavingUpdate;

  /* ----------------------------------
     State (LAZY INIT – NO EFFECT)
  ---------------------------------- */
  const [invoiceState, setInvoiceState] = useState<InvoiceEditorState>({
    header: {
      invoiceNo: "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      customerName: "",
      address: "",
      city: "",
      notes: "",
      taxPct: 0,
      taxAmt: 0,
    },
    lines: [createEmptyLine()],
  });
  useEffect(() => {
    // only edit mode
    if (!invoiceID) return;

    // data not yet loaded
    if (!invoiceData) return;

    // prevent re-initialization (StrictMode safe)
    if (isInitializedRef.current) return;

    setInvoiceState({
      header: {
        invoiceID: invoiceData.invoiceID,
        invoiceNo: invoiceData.invoiceNo,
        invoiceDate: invoiceData.invoiceDate.slice(0, 10),
        customerName: invoiceData.customerName,
        address: invoiceData.address ?? "",
        city: invoiceData.city ?? "",
        notes: invoiceData.notes ?? "",
        taxPct: invoiceData.taxPercentage ?? 0,
        taxAmt: invoiceData.taxAmount ?? 0,
        updatedOn: invoiceData.updatedOn,
      },
      lines:
  invoiceData.lines.length > 0
    ? invoiceData.lines.map((l) => {
        const qty = Number(l.quantity);          // ✅ backend field
        const rate = Number(l.rate);
        const discount = Number(l.discountPct ?? 0);

        const amount = qty * rate * (1 - discount / 100); // ✅ frontend calc

        return {
          rowId: crypto.randomUUID(),
          itemID: l.itemID,
          description: l.description ?? "",
          qty,                     // ✅ FIXED
          rate,
          discountPct: discount,
          amount,                  // ✅ FIXED
        };
      })
    : [createEmptyLine()],

    });

    isInitializedRef.current = true;
  }, [invoiceID, invoiceData]);

  /* ----------------------------------
     Derived
  ---------------------------------- */
  const subTotal = useMemo(
    () => invoiceState.lines.reduce((sum, l) => sum + l.amount, 0),
    [invoiceState.lines],
  );

  /* ----------------------------------
     Handlers
  ---------------------------------- */
  const handleHeaderChange = (
    field: keyof InvoiceHeader,
    value: InvoiceHeader[keyof InvoiceHeader],
  ) => {
    setInvoiceState((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const handleLinesChange = (lines: InvoiceLine[]) => {
    setInvoiceState((prev) => ({
      ...prev,
      lines,
    }));
  };

  const handleTotalsChange = (taxPct: number, taxAmt: number) => {
    setInvoiceState((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        taxPct,
        taxAmt,
      },
    }));
  };
  const handleSaveError = useCallback(
    (err: FetchBaseQueryError | SerializedError) => {
      // RTK Query error shape
      if ("status" in err) {
        const status = err?.status;

        // 1️⃣ Backend validation error
        if (status === 400) {
          setHeaderErrors((prev) => ({
            ...prev,
            invoiceNo: "Invoice no exists.",
          }));
          toast.error("Invoice number already exists");
          return;
        }

        // 2️⃣ Concurrency conflict (placeholder – Step 4)
        if (status === 409) {
          toast.error("Invoice changed. Reload.");
          return;
        }

        // 3️⃣ Server error
        if (status === 500) {
          toast.error("Server error. Please try again later.");
          return;
        }

        // 4️⃣ Network / unknown
        toast.error("Network error. Please check your connection.");
      }
    },
    [],
  );

  /* ----------------------------------
     Save
  ---------------------------------- */
  // 🔴 imports SAME rahenge

  /* ----------------------------------
   Save
---------------------------------- */
  const handleSave = useCallback(async () => {
    // 1️⃣ Header validation
    const headerErrors = validateInvoiceDetails(invoiceState.header);
    setHeaderErrors(headerErrors);

    const isEditMode = !!invoiceState.header.invoiceID;

    if (Object.keys(headerErrors).length > 0) {
      toast.error("Please fix header errors");
      return;
    }
    if (!invoiceState.header.invoiceNo) {
      toast.error("Invoice number is required");
      return;
    }
    // 2️⃣ Line validation
    if (!hasAtLeastOneValidLine(invoiceState.lines)) {
      toast.error("Please add at least one valid invoice line");
      return;
    }

    if (!lineItemsRef.current?.validate()) {
      toast.error("Please select an item for each line.");
      return;
    }

    // 3️⃣ Build lines payload (shared)
    const linesPayload = invoiceState.lines.map((l, index) => ({
      rowNo: index + 1,
      itemID: l.itemID!, // validated earlier
      description: l.description,
      quantity: l.qty,
      rate: l.rate,
      discountPct: l.discountPct ?? 0,
    }));

    // 4️⃣ FINAL PAYLOAD (🔥 FIXED)
    const payload = isEditMode
      ? {
          // ✏️ EDIT MODE
          invoiceID: invoiceState.header.invoiceID,
          invoiceNo: Number(invoiceState.header.invoiceNo), // ✅ ADD
          invoiceDate: invoiceState.header.invoiceDate,
          customerName: invoiceState.header.customerName,
          address: invoiceState.header.address || null,
          city: invoiceState.header.city || null,
          notes: invoiceState.header.notes || null,
          taxPercentage: invoiceState.header.taxPct,
          updatedOn: invoiceState.header.updatedOn, // 🔥 REQUIRED
          lines: linesPayload,
        }
      : {
          // ➕ ADD MODE
          invoiceNo: Number(invoiceState.header.invoiceNo), // 🔥 MUST
          invoiceDate: invoiceState.header.invoiceDate,
          customerName: invoiceState.header.customerName,
          address: invoiceState.header.address || null,
          city: invoiceState.header.city || null,
          notes: invoiceState.header.notes || null,
          taxPercentage: invoiceState.header.taxPct,
          lines: linesPayload,
        };

    console.log("SAVE PAYLOAD", JSON.stringify(payload, null, 2));

    try {
      if (isEditMode) {
        await updateInvoice(payload).unwrap(); // PUT
      } else {
        await insertInvoice(payload).unwrap(); // POST
      }
      toast.success("Invoice saved / Updated successfully");
      navigate("/invoices");
    } catch (err) {
      console.error("Save invoice failed:", err);
      handleSaveError(err as FetchBaseQueryError | SerializedError);
    }
  }, [
    invoiceState, 
    insertInvoice, 
    updateInvoice, 
    navigate, 
    handleSaveError
  ]);

  useEffect(() => {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Handles Ctrl + Enter keypress by saving the invoice.
     * @param {KeyboardEvent} e - The keypress event.
     */
    /*******  6daeb9de-912b-4b20-9fc7-ac611cd75ba3  *******/
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  /* ----------------------------------
     Loading / Error
  ---------------------------------- */
  if (invoiceID && isLoading) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (invoiceID && isError) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load invoice</Alert>
      </Box>
    );
  }

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        

      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={"#fff"}
        
        px={6}
        py={2}
        sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,}}
      >
        <Typography fontSize={24} fontWeight={600} color="#535255">
          {invoiceID ? "Edit Invoice" : "New Invoice"}
        </Typography>

        <Box display="flex" gap={1}>
          <Button 
          variant="text" 
          onClick={() => navigate(-1)} 
          sx={{fontWeight: 600, color: "#525355"}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              isSaving ||
              !invoiceState.header.invoiceNo ||
              !invoiceState.header.customerName ||
              !hasAtLeastOneValidLine(invoiceState.lines)
            }
            sx={{ bgcolor: "#525355" , fontWeight: 600,}}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1, // 🔑 remaining height only
          // 🔒 no page scroll
          bgcolor: "#f5f6f7",
          px: 6,
          py: 2,
        }}
      >
        <InvoiceDetails
          header={invoiceState.header}
          isEditMode={!!invoiceState.header.invoiceID} // ✅ ADD THIS
          error={headerErrors}
          onChange={handleHeaderChange}
        />

        <InvoiceLineItems
          ref={lineItemsRef}
          lines={invoiceState.lines}
          onChange={handleLinesChange}
        />

        <InvoiceTotals
          subTotal={subTotal}
          taxPct={invoiceState.header.taxPct}
          taxAmt={invoiceState.header.taxAmt}
          onChange={handleTotalsChange}
        />
      </Box>
    </Box>
  );
};

export default InvoiceEditor;
