import type { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../types/itemTypes";
import { Tooltip, Typography } from "@mui/material";
import ThumbnailCell from "./ThumbnailCell";

export const getItemColumns = (
  onEditItem: (item: Item) => void,
  onDeletItem: (item: number) => void,
): GridColDef<Item>[] => [
  {
    field: "pictureUrl", // 👈 MUST match backend field
    headerName: "Picture",
    sortable: false,
    width: 100,
    filterable: false,
    hideable: false,
    renderCell: (params) => {
      return <ThumbnailCell itemID={params.row.itemID} />;
    },
  },

  {
    field: "itemName",
    headerName: "Item Name",
    flex: 1,
    hideable: true,
    renderCell: (p) => (
      <Typography
        sx={{
          color: "#1f2937", // 👈 change color here
          fontWeight: 500,
        }}
      >
        {p.value}
      </Typography>
    ),
  },
  {
  field: "description",
  headerName: "Description",
  flex: 1,
  hideable: true,
  renderCell: (p) => {
    const raw = p.value ?? "";
    const text = raw.trim();

    // 🔥 EMPTY CASE
    if (!text) {
      return (
        <span style={{ color: "#9ca3af" }}>
          No Description
        </span>
      );
    }

    // 🔥 NORMAL CASE
    const truncated =
      text.length > 50 ? `${text.slice(0, 50)}…` : text;

    return (
      <Tooltip
        title={text}
        arrow
        disableHoverListener={text.length <= 50}
      >
        <span>{truncated}</span>
      </Tooltip>
    );
  },
},
{
    field: "salesRate",
    headerName: "Sale Rate",
    type: "number",
    hideable: true,
    flex: 1,
    renderCell: (params) =>
      `₹${Number(params.row.salesRate ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  },
  {
    field: "discountPct",
    headerName: "Discount %",
    type: "number",
    hideable: true,
    flex: 1,
    renderCell: (params) =>
      `${Number(params.row.discountPct ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
  },

  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    hideable: false,

    align: "right", // cell content
    headerAlign: "right", // header text

    renderCell: (params) => (
      <>
        <IconButton
          size="small"
          onClick={() => onEditItem(params.row)} // 🔥 YAHAN APPLY
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDeletItem(params.row.itemID)}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];
