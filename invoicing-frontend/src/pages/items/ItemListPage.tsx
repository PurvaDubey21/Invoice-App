import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { ItemToolbar } from "../items/ItemToolbar";
import { ItemTable } from "../items/ItemTable";
import { ItemDialog } from "../items/ItemDialog";

import type { Item } from "../../types/itemTypes";

export const ItemListPage = () => {
  /* ---------------- DIALOG STATE ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  /* ---------------- ADD ITEM ---------------- */
  const handleAddItem = () => {
    setEditItem(null);        // ✅ Add mode
    setDialogOpen(true);
  };

  /* ---------------- EDIT ITEM ---------------- */
  const handleEditItem = (item: Item) => {
    setEditItem(item);        // ✅ Edit mode
    setDialogOpen(true);
  };

  /* ---------------- CLOSE DIALOG ---------------- */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  return (
    <Box p={3}>
      {/* ---------- PAGE HEADER ---------- */}
      <Typography variant="h5" fontWeight={600}>
        Items
      </Typography>
      <Typography color="text.secondary" mb={2}>
        Manage your product and service catalog.
      </Typography>

      {/* ---------- TOOLBAR ---------- */}
      <ItemToolbar onAddItem={handleAddItem} />

      {/* ---------- TABLE ---------- */}
      <ItemTable onEditItem={handleEditItem} />

      {/* ---------- ADD / EDIT DIALOG ---------- */}
      <ItemDialog
        open={dialogOpen}
        editItem={editItem}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};
