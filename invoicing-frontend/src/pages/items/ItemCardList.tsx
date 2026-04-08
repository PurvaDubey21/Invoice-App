import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Item } from "../../types/itemTypes";

import ThumbnailCell from "./ThumbnailCell";

interface Props {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export const ItemCardList = ({ items, onEdit, onDelete }: Props) => {
  if (!items.length) {
    return (
      <Typography textAlign="center" color="text.secondary">
        No items found
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {items.map((item) => (
        <Card
          key={item.itemID}
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {/* 🔹 TOP ROW */}
              <Box display="flex" gap={2}>
                {/* ✅ THUMBNAIL FIX */}
                <ThumbnailCell itemID={item.itemID} />

                <Box flex={1}>
                  <Typography fontWeight={600} fontSize={16}>
                    {item.itemName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.description || "No description"}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* 🔹 DETAILS */}
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Sales Rate</Typography>
                  <Typography fontWeight={500}>
                    ₹
                    {Number(item.salesRate ?? 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Discount</Typography>
                  <Typography fontWeight={500}>
                    {Number(item.discountPct ?? 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    %
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              {/* 🔹 ACTIONS */}
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <IconButton size="small" onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(item.itemID)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
