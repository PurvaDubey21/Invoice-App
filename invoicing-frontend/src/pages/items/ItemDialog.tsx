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
  useInsertItemMutation,
  useUpdateItemMutation,
  useUploadItemPictureMutation,
  useLazyCheckDuplicateItemNameQuery,
} from "../../services/itemApiRtk";
import type { Item, ItemFormErrors } from "../../types/itemTypes";
import { validateItemForm } from "../../schemas/item.schema";

interface Props {
  open: boolean;
  fullScreen?: boolean;
  onClose: () => void;
  editItem?: Item | null;
  onSaved: (itemId: string) => void; // 🔥
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
    setRemoveImage(false); // 🔥 ADD THIS
  };

  const handleDialogEnter = () => {
    setRemoveImage(false); // 🔥 RESET IMAGE STATE
    if (editItem) {
      setItemName(editItem.itemName);
      setDescription(editItem.description ?? "");
      setSaleRate(String(editItem.saleRate));
      setDiscountPct(String(editItem.discountPct));
      setFile(null); // 🔥 ensure no stale file
    } else {
      resetForm();
    }
  };

  const handleItemNameBlur = async () => {
    const name = itemName.trim();
    if (!name) return;

    try {
      const res = await checkDuplicateName({
        ItemName: name,
        ExcludeID: editItem?._id, // 👈 edit case skip self
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
    /* ---------- STEP 1: VALIDATION ---------- */
    const formErrors = validateItemForm({
      itemName,
      description,
      saleRate,
      discountPct,
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // 👈 inline errors show
      return; // 👈 STOP API CALL
    }

    try {
      setIsSaving(true);
      let itemId = editItem?._id;

      /* ---------- STEP 2: INSERT / UPDATE ---------- */
      if (editItem) {
        await updateItem({
          id: editItem._id,
          body: {
            itemName: itemName.trim(),
            description: description.trim(),
            saleRate: Number(saleRate),
            discountPct: Number(discountPct),
            updatedOnPrev: editItem.updatedOn,
            removeImage,
          },
        }).unwrap();
      } else {
        const res = await insertItem({
          itemName: itemName.trim(),
          description: description.trim(),
          saleRate: Number(saleRate),
          discountPct: Number(discountPct),
        }).unwrap();

        itemId = res.itemID;
      }

      /* ---------- STEP 3: IMAGE UPLOAD ---------- */
      if (file && itemId) {
        await uploadPicture({ id: itemId, file }).unwrap();
      }

      // ✅ SUCCESS TOAST (RIGHT PLACE)
      toast.success(
        editItem ? "Item updated successfully" : "Item added successfully"
      );

      /* ---------- STEP 4: CLEANUP ---------- */
      onSaved(itemId!); // 🔥 notify parent
      onClose();
      resetForm();
      setErrors({}); // 👈 clear errors on success
    } catch (err) {
      const error = err as FetchBaseQueryError;
      if (error.status === 413) {
        toast.error("Image size should be less than 2 MB");
        return;
      }
      if (error.status === 409) {
        setErrors((prev) => ({
          ...prev,
          itemName: "Name already exists.",
        }));
        return;
      }

      if (error.status === 412) {
        setConcurrencyError(true); // 🔥 POPUP TRIGGER
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
