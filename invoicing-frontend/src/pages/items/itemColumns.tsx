import type { GridColDef} from "@mui/x-data-grid";
import { IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../types/itemTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getItemColumns = (
  onEditItem: (item: Item) => void
): GridColDef<Item>[] => [
  {
  field: "pictureUrl", // 👈 MUST match backend field
  headerName: "",
  width: 60,
  sortable: false,
  filterable: false,
  renderCell: (params) => {
    const imageUrl = params.value
      ? `${BASE_URL}${params.value}`
      : null;

    return (
      <Avatar
        variant="rounded"
        src={imageUrl ?? undefined}
        alt="item"
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#f0f0f0",
        }}
      />
    );
  },
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
    renderCell: (params) => (
      <>
        <IconButton size="small"
        onClick={() => onEditItem(params.row)} // 🔥 YAHAN APPLY
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
  },
];
