import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Invoice } from "../../types/invoice.types"; // ✅ reuse type

interface Props {
  rows: Invoice[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export const InvoiceTable = ({ rows, loading, onDelete }: Props) => {
  const columns: GridColDef<Invoice>[] = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1 },

    { field: "invoiceDate", headerName: "Date", flex: 1 },

    { field: "customerName", headerName: "Customer", flex: 1 },

    { field: "subTotal", headerName: "Sub Total", flex: 1 },

    { field: "taxAmount", headerName: "Tax", flex: 1 },

    {
  field: "invoiceAmount",
  headerName: "Total",
  flex: 1,
  renderCell: (params) => {
    const value = params.row.invoiceAmount;

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  },
},


    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <EditIcon />
          </IconButton>

          <IconButton size="small">
            <PrintIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => onDelete(params.row.invoiceID)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={(row) => row.invoiceID} // ✅ correct
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      sx={{ border: "none" }}
    />
  );
};
