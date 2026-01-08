import { Box, Typography } from "@mui/material";
import { ItemToolbar } from "../items/ItemToolbar";
import { ItemTable } from "../items/ItemTable";

export const ItemListPage = () => {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600}>
        Items
      </Typography>
      <Typography color="text.secondary" mb={2}>
        Manage your product and service catalog.
      </Typography>

      <ItemToolbar />
      <ItemTable />
    </Box>
  );
};
