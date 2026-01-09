import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Avatar,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import {
  useInsertItemMutation,
  useUpdateItemMutation,
  useUploadItemPictureMutation,
} from "../../services/itemApiRtk";
import type { Item } from "../../types/itemTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

export const ItemDialog = ({ open, onClose, editItem }: Props) => {
  /* ---------------- FORM STATE ---------------- */
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [saleRate, setSaleRate] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [file, setFile] = useState<File | null>(null);

  /* 🔥 ADD THIS HERE (JUST AFTER STATE) */
  const previewUrl = file
    ? URL.createObjectURL(file)
    : editItem?.pictureUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${editItem.pictureUrl}`
    : undefined;

  /* ---------------- API ---------------- */
  const [insertItem] = useInsertItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const [uploadPicture] = useUploadItemPictureMutation();

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setItemName("");
    setDescription("");
    setSaleRate("");
    setDiscountPct("");
    setFile(null);
  };

  const handleDialogEnter = () => {
    if (editItem) {
      setItemName(editItem.itemName);
      setDescription(editItem.description ?? "");
      setSaleRate(String(editItem.saleRate));
      setDiscountPct(String(editItem.discountPct));
    } else {
      resetForm();
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      let itemId = editItem?._id;

      if (editItem) {
        await updateItem({
          id: editItem._id,
          body: {
            itemName,
            description,
            saleRate: Number(saleRate),
            discountPct: Number(discountPct),
            updatedOnPrev: editItem.updatedOn,
          },
        }).unwrap();
      } else {
        const res = await insertItem({
          itemName,
          description,
          saleRate: Number(saleRate),
          discountPct: Number(discountPct),
        }).unwrap();
        itemId = res.itemID;
      }

      if (file && itemId) {
        await uploadPicture({ id: itemId, file }).unwrap();
      }

      onClose();
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onEnter: handleDialogEnter,
      }}
    >
      {/* ---------------- TITLE ---------------- */}
      <DialogTitle sx={{ fontWeight: 600 }}>
        {editItem ? "Edit Item" : "New Item"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ---------------- CONTENT ---------------- */}
      <DialogContent dividers>
        <Stack spacing={2}>
          {/* ---------- ITEM PICTURE ---------- */}
          <Box display="flex" gap={2} alignItems="center">
            <Avatar
              variant="rounded"
              src={previewUrl}
              sx={{ width: 64, height: 64, bgcolor: "#f5f5f5" }}
            >
              {!previewUrl && <ImageIcon color="disabled" />}
            </Avatar>

            <Box>
              <Button variant="outlined" component="label" size="small">
                Choose File
                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </Button>
              <Typography variant="caption" display="block">
                PNG / JPG, max 2MB
              </Typography>
            </Box>
          </Box>

          {/* ---------- ITEM NAME ---------- */}
          <TextField
            label="Item Name"
            placeholder="Enter item name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          {/* ---------- DESCRIPTION ---------- */}
          <TextField
            label="Description"
            placeholder="Enter item description"
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 500 }}
            helperText={`${description.length}/500`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* ---------- RATE + DISCOUNT ---------- */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <TextField
                label="Sale Rate"
                placeholder="0.00"
                type="number"
                fullWidth
                value={saleRate}
                onChange={(e) => setSaleRate(e.target.value)}
              />
            </Box>

            <Box flex={1}>
              <TextField
                label="Discount %"
                placeholder="0 %"
                type="number"
                fullWidth
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
              />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      {/* ---------------- ACTIONS ---------------- */}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
