import React, { useMemo, useState, useEffect , useRef} from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  useGetInvoiceByIdQuery,
  useSaveInvoiceMutation,
} from "../../services/invoiceApi";

import InvoiceDetails from "../../components/InvoiceEditor/InvoiceDetails";
import InvoiceLineItems from "../../components/InvoiceEditor/InvoiceLineItems";
import InvoiceTotals from "../../components/InvoiceEditor/InvoiceTotals";
import  { validateInvoiceDetails } from "../../utils/invoiceDetails.validators";
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

  const invoiceIDParam = params.get("invoiceID");
  const invoiceID = invoiceIDParam ? Number(invoiceIDParam) : null;
  const [headerErrors, setHeaderErrors] = useState<InvoiceHeaderErrors>({});

  /* ----------------------------------
     API
  ---------------------------------- */
  const {
    data: invoiceData,
    isLoading,
    isError,
  } = useGetInvoiceByIdQuery({ invoiceID: invoiceID! }, { skip: !invoiceID });

  const [saveInvoice, { isLoading: isSaving }] = useSaveInvoiceMutation();

  /* ----------------------------------
     State (LAZY INIT – NO EFFECT)
  ---------------------------------- */
  const [invoiceState, setInvoiceState] =
  useState<InvoiceEditorState>({
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
      taxPct: invoiceData.taxPct ?? 0,
      taxAmt: invoiceData.taxAmt ?? 0,
      updatedOn: invoiceData.updatedOn,
    },
    lines:
      invoiceData.lines.length > 0
        ? invoiceData.lines.map((l) => ({
            rowId: crypto.randomUUID(),
            itemID: l.itemID,
            description: l.description ?? "",
            qty: l.qty,
            rate: l.rate,
            discountPct: l.discountPct,
            amount: l.amount,
          }))
        : [createEmptyLine()],
  });

  isInitializedRef.current = true;
}, [invoiceID, invoiceData]);

  /* ----------------------------------
     Derived
  ---------------------------------- */
  const subTotal = useMemo(
    () => invoiceState.lines.reduce((sum, l) => sum + l.amount, 0),
    [invoiceState.lines]
  );

  /* ----------------------------------
     Handlers
  ---------------------------------- */
  const handleHeaderChange = (
    field: keyof InvoiceHeader,
    value: InvoiceHeader[keyof InvoiceHeader]
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

  /* ----------------------------------
     Save
  ---------------------------------- */
  const handleSave = async () => {
    // 1️⃣ Header validation
  const headerErrors = validateInvoiceDetails(invoiceState.header);
  setHeaderErrors(headerErrors);

  if (Object.keys(headerErrors).length > 0) {
    console.log("Header validation failed:", headerErrors);
    return; // ❌ stop save
  }

  // 2️⃣ LINE-LEVEL CROSS VALIDATION (🔥 THIS PART)
  const hasValidLine = hasAtLeastOneValidLine(invoiceState.lines);
  if (!hasValidLine) {
    alert("Please add at least one invoice line with an item and qty > 0.");
    return; // ❌ stop save
  }
    const payload = {
      invoiceID: invoiceState.header.invoiceID,
      invoiceNo: invoiceState.header.invoiceNo,
      invoiceDate: invoiceState.header.invoiceDate,
      customerName: invoiceState.header.customerName,
      address: invoiceState.header.address,
      city: invoiceState.header.city,
      notes: invoiceState.header.notes,
      taxPct: invoiceState.header.taxPct,
      taxAmt: invoiceState.header.taxAmt,
      updatedOnPrev: invoiceState.header.updatedOn ?? null,
      lines: invoiceState.lines.map(
        ({ itemID, description, qty, rate, discountPct }) => ({
          itemID,
          description,
          qty,
          rate,
          discountPct,
        })
      ),
    };

    await saveInvoice(payload).unwrap();
    navigate("/invoice");
  };

  /* ----------------------------------
     Loading / Error
  ---------------------------------- */
  if (invoiceID && isLoading) {
    return (
      <Box p={3}>
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
    }} >
        
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={"#fff"}
        px={6}
        py={2}
        >
        <Typography variant="h6">
          {invoiceID ? "Edit Invoice" : "New Invoice"}
        </Typography>

        <Box display="flex" gap={1}>
          <Button 
          variant="text"  
          onClick={() => navigate(-1)}
          color="inherit"
          >
            Cancel
          </Button>
          <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={isSaving}
          sx={{bgcolor: "#525355"}}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box  sx={{
        flex: 1,                 // 🔑 remaining height only
            // 🔒 no page scroll
        bgcolor: "#f5f6f7",
        px: 6,
        py:2
      }}>
        <InvoiceDetails
          header={invoiceState.header}
          error={headerErrors}
          onChange={handleHeaderChange}
        />

        <InvoiceLineItems
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
