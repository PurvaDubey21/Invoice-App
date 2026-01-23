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
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  useSaveItemMutation,
  useUploadItemPictureMutation,
  useLazyCheckDuplicateItemNameQuery,
} from "../../services/itemApiRtk";
import type { Item, ItemFormErrors, ItemPayload } from "../../types/itemTypes";
import { validateItemForm } from "../../schemas/item.schema";

interface Props {
  open: boolean;
  fullScreen?: boolean;
  onClose: () => void;
  editItem?: Item | null;
  onSaved: () => void; // 🔥
}

export const ItemDialog = ({
  open,
  fullScreen = false,
  onClose,
  editItem,
  onSaved,
}: Props) => {
  /* ---------------- FORM STATE ---------------- */
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [saleRate, setSaleRate] = useState("");
  const [discountPct, setDiscountPct] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [concurrencyError, setConcurrencyError] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  /* 🔥 ADD THIS HERE (JUST AFTER STATE) */
  const previewUrl = file
    ? URL.createObjectURL(file)
    : !removeImage && editItem?.pictureUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${editItem.pictureUrl}`
      : undefined;

  const [checkDuplicateName, { isFetching: isCheckingName }] =
    useLazyCheckDuplicateItemNameQuery();

  /* ---------------- API ---------------- */
  const [saveItem] = useSaveItemMutation();
  const [uploadPicture] = useUploadItemPictureMutation();

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setItemName("");
    setDescription("");
    setSaleRate("");
    setDiscountPct("");
    setFile(null);
    setRemoveImage(false); // 🔥 ADD THIS
  };

  const handleDialogEnter = () => {
    setRemoveImage(false); // 🔥 RESET IMAGE STATE
    if (editItem) {
      setItemName(editItem.itemName);
      setDescription(editItem.description ?? "");
      setSaleRate(String(editItem.salesRate));
      setDiscountPct(String(editItem.discountPct));
      setFile(null); // 🔥 ensure no stale file
    } else {
      resetForm();
    }
  };

  const handleItemNameBlur = async () => {
    const name = itemName.trim();
    if (!name) return;

    // 🔥 SAME NAME, SAME ITEM → SKIP CHECK
    if (editItem && name === editItem.itemName) return;

    try {
      const res = await checkDuplicateName({
        ItemName: name,
        ExcludeID: editItem?.itemID, // 👈 edit case skip self
      }).unwrap();

      if (res.exists) {
        setErrors((prev) => ({
          ...prev,
          itemName: "Name already exists.",
        }));
      }
    } catch (err) {
      console.error("Duplicate check failed", err);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const formErrors = validateItemForm({
      itemName,
      description,
      saleRate,
      discountPct,
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsSaving(true);

      let itemId: number | undefined;

      /* ================= ADD MODE ================= */
      if (!editItem) {
        const res = await saveItem({
          itemName: itemName.trim(),
          description: description.trim(),
          salesRate: Number(saleRate),
          discountPct: Number(discountPct),
        }).unwrap();

        console.log("SAVE ITEM RESPONSE (ADD):", res); // ✅ ADD LOG
        itemId = res.primaryKeyID;
      } else {
        /* ================= EDIT MODE ================= */

        const payload: ItemPayload = {
          itemID: editItem.itemID,
          itemName: itemName.trim(),
          description: description.trim(),
          salesRate: Number(saleRate),
          discountPct: Number(discountPct),
          updatedOnPrev: editItem.updatedOn ?? editItem.createdOn, // ✅ always fresh
          removeImage,
        };

        const res = await saveItem(payload).unwrap();
        console.log("SAVE ITEM RESPONSE:", res);

        /* 🔥🔥 YAHI ADD KARNA HAI (MOST IMPORTANT) */

        itemId = editItem.itemID;
      }
      console.log("FINAL ITEM ID FOR UPLOAD:", itemId);
      if (typeof itemId !== "number") {
        toast.error("Failed to save item. Please try again.");
        return;
      }
      /* ================= IMAGE UPLOAD ================= */
      if (file && typeof itemId === "number") {
        await uploadPicture({ id: itemId, file }).unwrap();
      }

      toast.success(
        editItem ? "Item updated successfully" : "Item added successfully",
      );
      onClose();
      onSaved();
      resetForm();
      setErrors({});
    } catch (err) {
      const error = err as FetchBaseQueryError;
      if (error.status === 409) {
        if (editItem) {
          toast.error(
            "This item was updated elsewhere. Please reopen and try again.",
          );
          onClose(); // 🔥 stale dialog close
        } else {
          setErrors({ itemName: "Name already exists." });
        }
        return;
      }

      if (error.status === 412) {
        setConcurrencyError(true);
        return;
      }

      if (error.status === 413) {
        toast.error("Image size should be less than 2 MB");
        return;
      }

      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null); // 🔥 remove selected image
    setRemoveImage(true); // mark existing image for deletion
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEnter: handleDialogEnter,
      }}
      /* ❌ Esc key disable */
      disableEscapeKeyDown
      /* ❌ Backdrop click disable */
      onClose={(reason) => {
        if (reason === "backdropClick") return;
        if (reason === "escapeKeyDown") return;
      }}
    >
      {/* ---------------- TITLE ---------------- */}
      <DialogTitle sx={{ fontWeight: 600, color: "#525355" }}>
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
            <Box position="relative">
              <Typography variant="body2" color="text.secondary" mb={2}>
                Item Picture
              </Typography>
              <Avatar
                variant="rounded"
                src={previewUrl}
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#f5f5f5",
                }}
              >
                {!previewUrl && <ImageIcon color="disabled" />}
              </Avatar>

              {/* 🔥 REMOVE IMAGE BUTTON */}
              {(file || (editItem?.pictureUrl && !removeImage)) && (
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: -2,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "grey.200" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Box mt={3}>
              <Button
                variant="outlined"
                component="label"
                size="small"
                color="inherit"
              >
                Choose File
                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </Button>

              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                PNG / JPG, max 2MB
              </Typography>
            </Box>
          </Box>

          {/* ---------- ITEM NAME ---------- */}
          <Typography variant="body2">Item Name *</Typography>
          <TextField
            label="Item Name"
            placeholder="Enter item name"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              setErrors((prev) => ({ ...prev, itemName: undefined }));
            }}
            onBlur={handleItemNameBlur}
            error={!!errors.itemName}
            helperText={isCheckingName ? "Checking name..." : errors.itemName}
          />

          {/* ---------- DESCRIPTION ---------- */}
          <Typography variant="body2"> Description </Typography>
          <TextField
            label="Description"
            placeholder="Enter item description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />

          {/* ---------- RATE + DISCOUNT ---------- */}
          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              <Typography variant="body2" mb={1}>
                {" "}
                Sale Rate *{" "}
              </Typography>
              <TextField
                label="Sale Rate"
                placeholder="0.00"
                type="number"
                fullWidth
                value={saleRate}
                onChange={(e) => setSaleRate(e.target.value)}
                error={!!errors.saleRate}
                helperText={errors.saleRate}
              />
            </Box>

            <Box flex={1}>
              <Typography variant="body2" mb={1}>
                {" "}
                Discount %{" "}
              </Typography>
              <TextField
                label="Discount %"
                placeholder="0 %"
                type="number"
                fullWidth
                value={discountPct}
                onChange={(e) => setDiscountPct(e.target.value)}
                error={!!errors.discountPct}
                helperText={errors.discountPct}
              />
            </Box>
          </Stack>
        </Stack>
      </DialogContent>

      {/* ---------------- ACTIONS ---------------- */}
      <DialogActions sx={{ bgcolor: "#f5f5f5", padding: 2, mr: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#525355",

            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(82,83,85,0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          sx={{
            color: "#ffffff",
            bgcolor: "#525355",
            textTransform: "none",
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
      <Dialog
        open={concurrencyError}
        onClose={() => setConcurrencyError(false)}
      >
        <DialogTitle>Data Conflict</DialogTitle>

        <DialogContent>
          <Typography>Item updated by another user, please reload.</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setConcurrencyError(false);
              onClose(); // close editor
            }}
          >
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
