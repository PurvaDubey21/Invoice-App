import { Box, Stack, Typography, Divider, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Invoice } from "../../types/invoice.types";

interface Props {
  rows: Invoice[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const formatCurrency = (value: number) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

export const InvoiceMobileCards = ({ rows, onEdit, onDelete }: Props) => {
  if (!rows.length) {
    return (
      <Typography textAlign="center" color="text.secondary">
        No invoices found
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {rows.map((inv) => (
        <Box
          key={inv.invoiceID}
          p={2}
          bgcolor="white"
          borderRadius={3}
          boxShadow={1}
        >
          <Stack spacing={1.2}>
            {/* HEADER */}
            <Typography fontWeight={700} fontSize={16}>
              Invoice #{inv.invoiceNo}
            </Typography>

            <Divider />

            {/* DETAILS */}
            <Typography>
              <b>Date:</b>{" "}
              {new Date(inv.invoiceDate).toLocaleDateString("en-GB")}
            </Typography>

            <Typography>
              <b>Customer:</b> {inv.customerName}
            </Typography>

            <Typography>
              <b>Items:</b> {inv.totalItems}
            </Typography>

            <Typography>
              <b>Sub Total:</b> {formatCurrency(inv.subTotal)}
            </Typography>

            <Typography>
              <b>Tax %:</b>{" "}
              {Number(inv.taxPercentage ?? 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </Typography>

            <Typography>
              <b>Tax:</b> {formatCurrency(inv.taxAmount)}
            </Typography>

            <Typography fontWeight={700}>
              <b>Total:</b> {formatCurrency(inv.invoiceAmount)}
            </Typography>

            <Divider />

            {/* ACTIONS */}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <IconButton size="small" onClick={() => onEdit?.(inv.invoiceID)}>
                <EditIcon />
              </IconButton>

              <IconButton size="small">
                <PrintIcon />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete?.(inv.invoiceID)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};
