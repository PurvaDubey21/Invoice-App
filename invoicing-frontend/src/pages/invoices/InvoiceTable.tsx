import type { GridColDef } from "@mui/x-data-grid";
import { IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Invoice } from "../../types/invoice.types";
import { DataTable } from "../../components/common/DataTable";
import type { InvoiceColumnKey } from "./invoiceColumns.config";

interface Props {
  rows: Invoice[];
  loading: boolean;
  visibleColumns?: InvoiceColumnKey[]; // 👈 optional to avoid crash
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const InvoiceTable = ({
  rows,
  loading,
  visibleColumns = [], // 👈 default value (IMPORTANT)
  onEdit,
  onDelete,
}: Props) => {
  /* -------------------------------
     BASE COLUMNS (PRD aligned)
  -------------------------------- */
  const BASE_COLUMNS: GridColDef[] = [
    {
      field: "invoiceNo",
      headerName: "Invoice No",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1f2937", // 👈 change color here
            fontWeight: 600,
          }}
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: "invoiceDate",
      headerName: "Date",
      flex: 1,

      renderCell: (params) =>
        params.value
          ? new Date(params.value as string).toLocaleDateString("en-GB")
          : "-",
    },

    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
    },
    {
      field: "totalItems",
      headerName: "Items",
      flex: 1,
    },
    {
      field: "subTotal",
      headerName: "Sub Total",
      flex: 1,

      renderCell: (params) => {
        const value = Number(params.value ?? 0);

        return `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    {
      field: "taxPercentage",
      headerName: "Tax %",
      flex: 1,

      renderCell: (params) => `${Number(params.value ?? 0).toFixed(2)} %`,
    },

    {
      field: "taxAmount",
      headerName: "Tax",
      flex: 1,

      renderCell: (params) => {
        const value = Number(params.value ?? 0);

        return `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`;
      },
    },

    {
      field: "invoiceAmount",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => {
        const value = Number(params.value ?? 0);

        return `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
  ];

  /* -------------------------------
     ACTION COLUMN
  -------------------------------- */
  const ACTION_COLUMN: GridColDef = {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    flex: 1,
    align: "right", // cell content
    headerAlign: "right", // header text
    renderCell: (params) => (
      <>
        <IconButton size="small" onClick={() => onEdit(params.row.invoiceID)}>
          <EditIcon />
        </IconButton>

        <IconButton size="small">
          <PrintIcon />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(params.row.invoiceID)}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  };

  /* -------------------------------
     FINAL COLUMNS (TOGGLE AWARE)
  -------------------------------- */
  const columns: GridColDef[] = [
    ...BASE_COLUMNS.filter((col) =>
      visibleColumns.length === 0
        ? true // 👈 show all if nothing selected
        : visibleColumns.includes(col.field as InvoiceColumnKey),
    ),
    ACTION_COLUMN,
  ];

  /* -------------------------------
     RENDER
  -------------------------------- */
  return (
    <DataTable
       
      rows={rows}
      columns={columns}
      loading={loading}
      height={400}
      getRowId={(row) => row.invoiceID}
    />
  );
};
