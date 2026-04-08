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
import DecimalField from "../common/DecimalField";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import { validateInvoiceLine } from "../../utils/invoiceLine.validators";
import {
  useGetItemLookupListQuery,
  useLazyGetItemByIdQuery,
} from "../../services/itemApiRtk";

import type {
  InvoiceLine,
  InvoiceLineErrors,
} from "../../types/invoiceEditor.types";

interface Props {
  lines: InvoiceLine[];
  onChange: (lines: InvoiceLine[]) => void;
}
export interface InvoiceLineItemsRef {
  validate: () => boolean;
}
/* ----------------------------------
   Helpers
---------------------------------- */
const round2 = (n: number) =>
  Math.round(n * 100) / 100;
const calcAmount = (l: InvoiceLine) => {
  const raw = l.qty * l.rate - (l.qty * l.rate * l.discountPct) / 100;
  return round2(raw);
};
  

const formatMoney = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(v);

const createEmptyLine = (): InvoiceLine => ({
  rowId: crypto.randomUUID(),
  itemID: null,
  description: "",
  qty: 1,
  rate: 0,
  discountPct: 0,
  amount: 0,
});

const InvoiceLineItems = React.forwardRef<InvoiceLineItemsRef, Props>(
  ({ lines, onChange }, ref) => {
    const [lineErrors, setLineErrors] = React.useState<
      Record<string, InvoiceLineErrors>
    >({});
    const [selectedRowId, setSelectedRowId] = React.useState<string | null>(
      null,
    );
    const [invalidRowIds, setInvalidRowIds] = React.useState<Set<string>>(
      new Set(),
    );
    const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

    const [triggerGetItemById] = useLazyGetItemByIdQuery();

    const { data: itemLookupList = [] } = useGetItemLookupListQuery();
    

    const [itemDetailMap, setItemDetailMap] = React.useState<
      Record<number, { salesRate: number; discountPct: number }>
    >({});

    const validateAllLines = () => {
      const invalidIds = new Set<string>();
      const errors: Record<string, InvoiceLineErrors> = {};

      lines.forEach((line) => {
        const err = validateInvoiceLine(line);
        if (Object.keys(err).length > 0) {
          invalidIds.add(line.rowId);
          errors[line.rowId] = err;
        }
      });

      setLineErrors(errors);
      setInvalidRowIds(invalidIds);

      return invalidIds;
    };

    const scrollToFirstInvalidRow = (invalidIds: Set<string>) => {
      const firstId = Array.from(invalidIds)[0];
      const el = rowRefs.current[firstId];

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    React.useImperativeHandle(ref, () => ({
      validate: () => {
        const invalidIds = validateAllLines();

        if (invalidIds.size > 0) {
          scrollToFirstInvalidRow(invalidIds);
          return false;
        }

        return true;
      },
    }));
    /* ----------------------------------
     Selected Item IDs (derived)
  ---------------------------------- */
    const selectedItemIDs = React.useMemo(
      () =>
        Array.from(
          new Set(
            lines
              .map((l) => l.itemID)
              .filter((id): id is number => typeof id === "number"),
          ),
        ),
      [lines],
    );
    /* ----------------------------------
     Fetch missing item details
  ---------------------------------- */
    React.useEffect(() => {
      const fetchMissingItems = async () => {
        for (const itemID of selectedItemIDs) {
          if (itemDetailMap[itemID]) continue;

          try {
            const data = await triggerGetItemById(itemID.toString()).unwrap();

            setItemDetailMap((prev) => ({
              ...prev,
              [itemID]: {
                salesRate: data.salesRate ?? 0,
                discountPct: data.discountPct ?? 0,
              },
            }));
          } catch (err) {
            console.error("Item detail fetch failed", err);
          }
        }
      };

      fetchMissingItems();
    }, [selectedItemIDs, triggerGetItemById]);

    /* ----------------------------------
     Apply item details to lines
  ---------------------------------- */
    React.useEffect(() => {
      let changed = false;

      const updatedLines = lines.map((line) => {
        if (!line.itemID) return line;

        const detail = itemDetailMap[line.itemID];
        if (!detail) return line;

        // ✅ DO NOT override if values already exist
        if (line.rate > 0 || line.discountPct > 0) {
          return line;
        }

        const updatedLine: InvoiceLine = {
          ...line,
          rate: detail.salesRate,
          discountPct: detail.discountPct,
          qty: line.qty > 0 ? line.qty : 1,
        };

        updatedLine.amount = calcAmount(updatedLine);
        changed = true;
        return updatedLine;
      });

      if (changed) onChange(updatedLines);
    }, [itemDetailMap, lines]);

    /* ----------------------------------
     Line handlers
  ---------------------------------- */
    const updateLine = <K extends keyof InvoiceLine>(
      index: number,
      field: K,
      value: InvoiceLine[K],
    ) => {
      const updated = [...lines];
      const line = {
        ...updated[index],
        [field]: value,
        isRateEdited: field === "rate" ? true : updated[index].isRateEdited,
        isDiscountEdited:
          field === "discountPct" ? true : updated[index].isDiscountEdited,
      };
      line.amount = calcAmount(line);
      updated[index] = line;
      const err = validateInvoiceLine(line);
      setLineErrors((prev) => ({
        ...prev,
        [line.rowId]: validateInvoiceLine(line),
      }));

      setInvalidRowIds((prev) => {
        const next = new Set(prev);
        if (Object.keys(err).length === 0) {
          next.delete(line.rowId); // ✅ clear red highlight
        }
        return next;
      });
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
    const hasValidQtyLine = lines.some((l) => l.qty > 0);

    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.key.toLowerCase() === "n") {
          e.preventDefault();
          addRow();
        }

        if (e.key === "Delete" && !(e.target instanceof HTMLInputElement)) {
          handleDeleteSelected();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lines, selectedRowId]);

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
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.secondary"
              fontSize={18}
            >
              Line Items
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addRow}
                sx={{
                  color: "#525355",
                  borderColor: "#525355",
                  fontWeight: 600,
                }}
              >
                Add Row
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopySelected}
                disabled={!selectedRowId}
                sx={{
                  color: "#525355",
                  borderColor: "#525355",
                  fontWeight: 600,
                }}
              >
                Copy
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteSelected}
                disabled={!selectedRowId || lines.length <= 1}
                sx={{
                  color: "#525355",
                  borderColor: "#525355",
                  fontWeight: 600,
                }}
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
              color: "text.secondary",
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
                  component="div" // ✅ ADD THIS
                  ref={(el) => {
                    rowRefs.current[line.rowId] = el;
                  }}
                  key={line.rowId}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  onClick={() => setSelectedRowId(line.rowId)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: invalidRowIds.has(line.rowId)
                      ? "#fdecea" // light red
                      : selectedRowId === line.rowId
                        ? "#eef2f6"
                        : "transparent",
                  }}
                >
                  {/* S.No */}
                  <Box width={50}>
                    <Typography color="text.secondary" fontWeight={600}>
                      {index + 1}
                    </Typography>
                   </Box>

                  {/* Item Dropdown (dummy for now) */}
                  <Box flex={2}>
                    <TextField
                      label="Select Item"
                      size="small"
                      select
                      fullWidth
                      variant="outlined"
                      value={line.itemID ?? ""}
                      error={!!err.itemID}
                      helperText={err.itemID}
                      onChange={(e) => {
                        const selectedItemID = Number(e.target.value);
                        const item = itemLookupList.find(
                          (i) => i.itemID === selectedItemID,
                        );

                        if (!item) return;
                        const detail = itemDetailMap[selectedItemID];

                        const updatedLine: InvoiceLine = {
                          ...lines[index],
                          itemID: item.itemID,
                          description: "",
                          qty: lines[index].qty > 0 ? lines[index].qty : 1,
                          rate:
                            lines[index].rate > 0
                              ? lines[index].rate
                              : (detail?.salesRate ?? 0),

                          discountPct:
                            lines[index].discountPct > 0
                              ? lines[index].discountPct
                              : (detail?.discountPct ?? 0),
                        };

                        updatedLine.amount = calcAmount(updatedLine);

                        const updatedLines = [...lines];
                        updatedLines[index] = updatedLine;

                        setLineErrors((prev) => ({
                          ...prev,
                          [updatedLine.rowId]: validateInvoiceLine(updatedLine),
                        }));

                        setInvalidRowIds((prev) => {
                          const next = new Set(prev);
                          next.delete(updatedLine.rowId);
                          return next;
                        });

                        onChange(updatedLines);
                      }}
                    >
                      {itemLookupList.length === 0 ? (
                        <MenuItem disabled>No items found</MenuItem>
                      ) : (
                        itemLookupList.map((item) => (
                          <MenuItem key={item.itemID} value={item.itemID}>
                            {item.itemName}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Box>

                  {/* Description */}
                  <Box flex={3}>
                    <TextField
                      size="small"
                      fullWidth
                      variant="outlined"
                      disabled={!line.itemID}
                      placeholder="Description"
                      value={line.description ?? ""}
                      onChange={(e) =>
                        updateLine(index, "description", e.target.value)
                      }
                    />
                  </Box>

                  {/* Qty */}
                  <Box flex={1}>
                    <DecimalField
                      size="small"
                      fullWidth
                      disabled={!line.itemID}
                      value={line.qty === 0 ? "" : line.qty}
                      error={!!err.qty}
                      helperText={err.qty}
                     onValueChange={(val) =>
      updateLine(index, "qty", val)
    }
                      
                    />
                  </Box>

                  {/* Rate */}
                  <Box flex={1}>
                    <DecimalField
                      size="small"
                      fullWidth
                      disabled={!line.itemID}
                      value={line.rate === 0 ? "" : line.rate}
                      error={!!err.rate}
                      helperText={err.rate}
                      onValueChange={(val) =>
      updateLine(index, "rate", val)
    }
                      
  
                    />
                  </Box>

                  {/* Discount */}
                  <Box flex={1}>
                    <DecimalField
                      size="small"
                      fullWidth
                      disabled={!line.itemID}
                      value={line.discountPct === 0 ? "" : line.discountPct}
                      error={!!err.discountPct}
                      helperText={err.discountPct}
                     
                      onValueChange={(val) =>
                        updateLine(index, "discountPct", val)
                      }
                    />
                  </Box>

                  {/* Amount */}
                  <Box flex={1} textAlign="right">
                    <Typography fontWeight={500}>
                      {formatMoney(line.amount)}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>

          {/* ================= SUBTOTAL ================= */}
          {/* ===== Qty > 0 validation message ===== */}
          {!hasValidQtyLine && (
            <Typography color="error" mt={2}>
              Add at least one line with Qty &gt; 0.
            </Typography>
          )}

          {/* ================= SUBTOTAL ================= */}
          <Box
            mt={1}
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
            <Typography fontWeight={600}>{formatMoney(subTotal)}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  },
);

InvoiceLineItems.displayName = "InvoiceLineItems";

export default InvoiceLineItems;
