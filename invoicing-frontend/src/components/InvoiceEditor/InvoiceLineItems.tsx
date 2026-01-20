import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  MenuItem,
  //   IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { validateInvoiceLine } from "../../utils/invoiceLine.validators";
import { useGetItemLookupListQuery } from "../../services/itemApiRtk";

import type {
  InvoiceLine,
  InvoiceLineErrors,
} from "../../types/invoiceEditor.types";

interface Props {
  lines: InvoiceLine[];
  onChange: (lines: InvoiceLine[]) => void;
}

/* ----------------------------------
   Helpers
---------------------------------- */
const calcAmount = (l: InvoiceLine) =>
  Number((l.qty * l.rate - (l.qty * l.rate * l.discountPct) / 100).toFixed(2));

const createEmptyLine = (): InvoiceLine => ({
  rowId: crypto.randomUUID(),
  description: "",
  qty: 1,
  rate: 0,
  discountPct: 0,
  amount: 0,
});

const InvoiceLineItems: React.FC<Props> = ({ lines, onChange }) => {
  const [lineErrors, setLineErrors] = React.useState<
    Record<string, InvoiceLineErrors>
  >({});
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);

  const { data: itemLookupList = [] } = useGetItemLookupListQuery();
  console.log("itemLookupList:", itemLookupList);
  /* ----------------------------------
     Line handlers
  ---------------------------------- */
  const updateLine = (
    index: number,
    field: keyof InvoiceLine,
    value: InvoiceLine[keyof InvoiceLine]
  ) => {
    const updated = [...lines];
    const line = {
      ...updated[index],
      [field]: value,
    };
    line.amount = calcAmount(line);
    updated[index] = line;
    setLineErrors((prev) => ({
      ...prev,
      [line.rowId]: validateInvoiceLine(line),
    }));
    onChange(updated);
  };

  const addRow = () => {
    onChange([...lines, createEmptyLine()]);
  };

  const handleCopySelected = () => {
    if (!selectedRowId) return;

    const row = lines.find((l) => l.rowId === selectedRowId);
    if (!row) return;

    onChange([...lines, { ...row, rowId: crypto.randomUUID() }]);
  };

  const handleDeleteSelected = () => {
    if (!selectedRowId) return;
    if (lines.length <= 1) return;

    onChange(lines.filter((l) => l.rowId !== selectedRowId));
    setSelectedRowId(null);
  };

  const subTotal = lines.reduce((sum, l) => sum + l.amount, 0);

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* ================= HEADER ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={600}>Line Items</Typography>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addRow}
            >
              Add Row
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopySelected}
              disabled={!selectedRowId}
            >
              Copy
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={!selectedRowId || lines.length <= 1}
            >
              Delete
            </Button>
          </Stack>
        </Stack>

        {/* ================= TABLE HEADER ================= */}
        <Stack
          direction="row"
          spacing={1}
          pb={1}
          sx={{
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box width={50}>
            <Typography fontWeight={600}>S.No</Typography>
          </Box>
          <Box flex={2}>
            <Typography fontWeight={600}>Item *</Typography>
          </Box>
          <Box flex={3}>
            <Typography fontWeight={600}>Description</Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight={600}>Qty *</Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight={600}>Rate *</Typography>
          </Box>
          <Box flex={1}>
            <Typography fontWeight={600}>Disc %</Typography>
          </Box>
          <Box flex={1} textAlign="right">
            <Typography fontWeight={600}>Amount</Typography>
          </Box>
        </Stack>

        {/* ================= ROWS ================= */}
        <Stack spacing={1} mt={1}>
          {lines.map((line, index) => {
            const err: InvoiceLineErrors = lineErrors[line.rowId] || {};

            return (
              <Stack
                key={line.rowId}
                direction="row"
                spacing={1}
                alignItems="center"
                onClick={() => setSelectedRowId(line.rowId)}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    selectedRowId === line.rowId ? "#eef2f6" : "transparent",
                }}
              >
                {/* S.No */}
                <Box width={50}>
                  <Typography>{index + 1}</Typography>
                </Box>

                {/* Item Dropdown (dummy for now) */}
                <Box flex={2}>
                  <TextField
                    size="small"
                    select
                    fullWidth
                    variant="outlined"
                    value={line.itemID ?? ""}
                    error={!!err.itemID}
                    helperText={err.itemID}
                    onChange={(e) => {
                      const item = itemLookupList.find(
                        (i) => i._id === e.target.value
                      );

                      if (!item) return;

                      const updatedLine: InvoiceLine = {
                        ...lines[index],
                        itemID: item._id,
                        description: item.itemName,
                        rate: item.saleRate,
                        discountPct: item.discountPct,
                         qty: lines[index].qty > 0 ? lines[index].qty : 1, // 🔥 FIX
                      };

                      updatedLine.amount = calcAmount(updatedLine);

                      const updatedLines = [...lines];
                      updatedLines[index] = updatedLine;

                      setLineErrors((prev) => ({
                        ...prev,
                        [updatedLine.rowId]: validateInvoiceLine(updatedLine),
                      }));

                      onChange(updatedLines);
                    }}
                  >
                    {itemLookupList.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.itemName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Description */}
                <Box flex={3}>
                  <TextField
                    size="small"
                    fullWidth
                    variant="outlined"
                    placeholder="Description"
                    value={line.description}
                    onChange={(e) =>
                      updateLine(index, "description", e.target.value)
                    }
                  />
                </Box>

                {/* Qty */}
                <Box flex={1}>
                  <TextField
                    size="small"
                    type="number"
                    variant="outlined"
                    value={line.qty}
                    error={!!err.qty}
                    helperText={err.qty}
                    onChange={(e) => updateLine(index, "qty", +e.target.value)}
                  />
                </Box>

                {/* Rate */}
                <Box flex={1}>
                  <TextField
                    size="small"
                    type="number"
                    variant="outlined"
                    value={line.rate}
                    error={!!err.rate}
                    helperText={err.rate}
                    onChange={(e) => updateLine(index, "rate", +e.target.value)}
                  />
                </Box>

                {/* Discount */}
                <Box flex={1}>
                  <TextField
                    size="small"
                    type="number"
                    variant="outlined"
                    value={line.discountPct}
                    error={!!err.discountPct}
                    helperText={err.discountPct}
                    onChange={(e) =>
                      updateLine(index, "discountPct", +e.target.value)
                    }
                  />
                </Box>

                {/* Amount */}
                <Box flex={1} textAlign="right">
                  <Typography fontWeight={500}>
                    ₹ {line.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Stack>

        {/* ================= SUBTOTAL ================= */}
        <Box
          mt={2}
          pt={1}
          display="flex"
          justifyContent="flex-end"
          sx={{
            borderTop: "2px solid #e0e0e0",
          }}
        >
          <Typography fontWeight={600} mr={2}>
            Subtotal:
          </Typography>
          <Typography fontWeight={600}>₹ {subTotal.toFixed(2)}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceLineItems;
