import type { GridColDef} from "@mui/x-data-grid";
import { IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../types/itemTypes";
import { Tooltip } from "@mui/material";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getItemColumns = (
  onEditItem: (item: Item) => void,
  onDeletItem: (item: string) => void
): GridColDef<Item>[] => [
  {
  field: "pictureUrl", // 👈 MUST match backend field
  headerName: "Picture",
  width: 100,
  sortable: false,
  filterable: false,
  hideable: false,
  renderCell: (params) => {
    const imageUrl = params.row.thumbnailUrl
        ? `${BASE_URL}${params.row.thumbnailUrl}`
        : params.row.pictureUrl
        ? `${BASE_URL}${params.row.pictureUrl}`
        : undefined;

    return (
      
      <Avatar
        variant="rounded"
        src={imageUrl ?? undefined}
        alt="item"
        sx={{
          width: 55,
          height: 55,
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
    hideable: true,
    renderCell: (p) => <strong>{p.value}</strong>,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    hideable: true,
    renderCell: (p) => {
  const text = p.value ?? "";

  const truncated =
    text.length > 50 ? `${text.slice(0, 50)}…` : text;

  return (
    <Tooltip title={text} arrow disableHoverListener={text.length <= 50}>
      <span>{truncated}</span>
    </Tooltip>
  );
},
     
  },
  {
    field: "saleRate",
    headerName: "Sale Rate",
    type: "number",
    hideable: true,
    align: "right",
    width: 120,
    renderCell: (params) =>
      `₹${Number(params.row.saleRate ?? 0).toFixed(2)}`,
  },
  {
    field: "discountPct",
    headerName: "Discount %",
    type: "number",
    align: "right",
    width: 120,
    hideable: true,
    renderCell: (params) =>
      `${Number(params.row.discountPct ?? 0).toFixed(2)}%`,
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    hideable: false,
    width: 100,
    
    renderCell: (params) => (
      <>
        <IconButton size="small"
        onClick={() => onEditItem(params.row)} // 🔥 YAHAN APPLY
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error"
          onClick={()=> onDeletItem(params.row._id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </>
    ),
  },
];
