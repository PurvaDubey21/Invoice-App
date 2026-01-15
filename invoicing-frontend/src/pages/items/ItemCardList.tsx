import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Item } from "../../types/itemTypes";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Props {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export const ItemCardList = ({ items, onEdit, onDelete }: Props) => {
  return (
    <Stack spacing={2}>
      {items.map((item) => {
        const imageUrl = item.thumbnailUrl
          ? `${BASE_URL}${item.thumbnailUrl}`
          : item.pictureUrl
          ? `${BASE_URL}${item.pictureUrl}`
          : undefined;

        return (
          <Card key={item._id} variant="outlined">
            <CardContent>
              <Box display="flex" gap={2}>
                {/* 🖼 Picture */}
                <Avatar
                  variant="rounded"
                  src={imageUrl}
                  sx={{ width: 56, height: 56 }}
                />

                {/* 📦 Content */}
                <Box flex={1}>
                  <Typography fontWeight={600}>
                    {item.itemName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {item.description}
                  </Typography>

                  {/* 💰 Rate & Discount */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Typography>
                      ₹{item.saleRate.toFixed(2)}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.discountPct.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>

                {/* ⚙ Actions */}
                <Box>
                  <IconButton onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(item._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};
