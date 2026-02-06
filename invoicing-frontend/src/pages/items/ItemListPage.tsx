import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  useGetItemListQuery,
  useDeleteItemMutation,
} from "../../services/itemApiRtk";
import { ItemToolbar } from "../items/ItemToolbar";
import { ItemTable } from "../items/ItemTable";
import { ItemDialog } from "../items/ItemDialog";
import { ConfirmDeleteDialog } from "../../components/common/ConfirmDeleteDialog";
import { useDebounce } from "../../hooks/useDebounce";
import { exportToCsv } from "../../utils/exportCsv";
import { ITEM_COLUMNS_CONFIG } from "../items/itemColumnsConfig";
import { exportToExcel } from "../../utils/exportExcel";
import { ColumnChooser } from "../../components/layout/ColumnChooser";

import type { Item } from "../../types/itemTypes";
import { ItemCardList } from "./ItemCardList";

export const ItemListPage = () => {

  
  /* ---------------- API ---------------- */
  const { data: items = [], isLoading, refetch } = useGetItemListQuery();
  const [deleteItem] = useDeleteItemMutation();

  /* ---------------- UI STATE ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    ITEM_COLUMNS_CONFIG.filter((c) => c.defaultVisible).map((c) => c.field)
  );
  const [columnChooserOpen, setColumnChooserOpen] = useState(false);
  const handleOpenColumnChooser = () => {
    setColumnChooserOpen(true);
  };
  const handleCloseColumnChooser = () => {
    setColumnChooserOpen(false);
  };

  /* ---------------- SEARCH ---------------- */
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ---------------- ADD ITEM ---------------- */
  const handleAddItem = () => {
    setSelectedItemId(null); // add mode
    setDialogOpen(true);
  };

  /* ---------------- EDIT ITEM ---------------- */
  const handleEditItem = (item: Item) => {
    setSelectedItemId(item.itemID);
    setDialogOpen(true);
  };

  /* ---------------- CLOSE DIALOG ---------------- */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItemId(null);
  };

  /* ---------------- DELETE ITEM ---------------- */
  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;

    try {
      setIsDeleting(true);
      await deleteItem(deleteItemId.toString()).unwrap();
      setDeleteItemId(null);
      // 🔥 RTK Query auto-refetches list
    }finally {
      setIsDeleting(false);
    }
  };

  /* ---------------- SEARCH FILTER (CLIENT-SIDE) ---------------- */
  const filteredItems = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    if (!keyword) return items;


    return items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(keyword) ||
        (item.description ?? "").toLowerCase().includes(keyword)
    );
  }, [items, debouncedSearch]);

  const exportableColumns = ITEM_COLUMNS_CONFIG.filter(
    (c): c is typeof c & { field: keyof Item } =>
      c.exportable && c.field in ({} as Item)
  )
    .filter((c) => visibleColumns.includes(c.field))
    .map((c) => ({
      field: c.field,
      label: c.label,
    }));

  const handleExportCsv = () => {
    if (!filteredItems.length) return;
    exportToCsv(
      `Items_${new Date().toISOString().slice(0, 10)}.csv`,
      filteredItems,
      exportableColumns
    );
  };
  const handleExportExcel = () => {
    if (!filteredItems.length) return;
    exportToExcel(
      `Items_${new Date().toISOString().slice(0, 10)}.xlsx`,
      filteredItems,
      exportableColumns
    );
  };

  return (
    <Box
      sx={{

        backgroundColor: "#f5f6f7",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          px: 6,
          py: 2,
        }}
      >
        {/* ---------- PAGE HEADER ---------- */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={600}
          color="#525355"
        >
          Items
        </Typography>
        <Typography color="text.secondary" mb={2} fontSize={isMobile ? 13 : 14}>
          Manage your product and service catalog.
        </Typography>
      </Box>
      {/* ---------- TOOLBAR ---------- */}

      <ItemToolbar
        onAddItem={handleAddItem}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onOpenColumnChooser={handleOpenColumnChooser}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <Box p={6}>
        {/* ---------- TABLE ---------- */}
        {isMobile ? (
          <ItemCardList
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={(id) => setDeleteItemId(id)}
          />
        ) : (
          <ItemTable
            rows={filteredItems}
            loading={isLoading}
            visibleColumns={visibleColumns}
            onEditItem={handleEditItem}
            onDeleteItem={(id) => setDeleteItemId(id)}
          />
        )}
      </Box>

      {/* ---------- ADD / EDIT DIALOG ---------- */}
      <ItemDialog
        open={dialogOpen}
        fullScreen={isMobile}
        itemId={selectedItemId}   // 🔥 PASS ID ONLY
        onClose={handleCloseDialog}
        onSaved={() => {
          refetch();
        }}
      />

      {/* ---------- DELETE CONFIRM ---------- */}
      <ConfirmDeleteDialog
        open={!!deleteItemId}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        loading={isDeleting}
        onCancel={() => setDeleteItemId(null)}
        onConfirm={handleDeleteConfirm}
      />
      <ColumnChooser
        open={columnChooserOpen}
        onClose={handleCloseColumnChooser}
        columns={ITEM_COLUMNS_CONFIG.filter((c) => c.exportable)}
        visibleColumns={visibleColumns}
        onChange={setVisibleColumns}
      />
    </Box>
  );
};
