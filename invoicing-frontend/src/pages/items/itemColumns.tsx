import type { GridColDef} from "@mui/x-data-grid";
import { IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "./item.types";


export const columns: GridColDef<Item>[] = [
  {
    field: "picture",
    headerName: "",
    width: 60,
    renderCell: () => <Avatar variant="rounded" />,
    sortable: false,
  },
  {
    field: "itemName",
    headerName: "Item Name",
    flex: 1,
    renderCell: (p) => <strong>{p.value}</strong>,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    renderCell: (p) =>
      p.value?.length > 50 ? `${p.value.slice(0, 50)}…` : p.value,
  },
  {
    field: "saleRate",
    headerName: "Sale Rate",
    type: "number",
    align: "right",
    renderCell: (params) =>
      `₹${Number(params.row.saleRate ?? 0).toFixed(2)}`,
  },
  {
    field: "discountPct",
    headerName: "Discount %",
    type: "number",
    align: "right",
    renderCell: (params) =>
      `${Number(params.row.discountPct ?? 0).toFixed(2)}%`,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    renderCell: () => (
      <>
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
  },
];
