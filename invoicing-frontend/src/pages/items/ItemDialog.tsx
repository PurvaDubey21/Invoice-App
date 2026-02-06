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
import { useEffect, useRef, useState } from "react";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import {
  useSaveItemMutation,
  useGetItemByIdQuery,
  useUploadItemPictureMutation,
  useGetItemPictureQuery,
  useLazyCheckDuplicateItemNameQuery,
} from "../../services/itemApiRtk";
import type { ItemFormErrors, ItemPayload } from "../../types/itemTypes";
import { validateItemForm } from "../../schemas/item.schema";

interface Props {
  open: boolean;
  fullScreen?: boolean;
  onClose: () => void;
  itemId?: number | null;
  onSaved: () => void; // 🔥
}

export const ItemDialog = ({
  open,
  fullScreen = false,
  onClose,
  itemId,
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

  /* 🔥 MOST IMPORTANT */
  const updatedOnRef = useRef<string | null>(null);

  const { data: editItem, refetch } = useGetItemByIdQuery(String(itemId), {
    skip: itemId == null,
    refetchOnMountOrArgChange: true,
  });

  const { data: pictureUrl } = useGetItemPictureQuery(itemId!, {
    skip: !itemId,
  });

  /* 🔥 ADD THIS HERE (JUST AFTER STATE) */
  const previewUrl = file
    ? URL.createObjectURL(file)
    : itemId && !removeImage && pictureUrl
      ? typeof pictureUrl === "string"
        ? pictureUrl
        : pictureUrl.url
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
    setRemoveImage(false); // 🔥 ADD THIS2
    setErrors({});
  };

  useEffect(() => {
    if (!open) return;

    // ADD MODE
    if (!itemId) {
      resetForm();
      updatedOnRef.current = null;
      return;
    }

    // EDIT MODE – wait for fresh server data
    if (editItem) {
      console.log("PREFILL FORM FROM editItem", editItem);

      setItemName(editItem.itemName);
      setDescription(editItem.description ?? "");
      setSaleRate(String(editItem.salesRate));
      setDiscountPct(String(editItem.discountPct));
      setFile(null);
      setRemoveImage(false);
      // 🔥 FREEZE SERVER VERSION
      updatedOnRef.current = editItem.updatedOn;
    }
  }, [open, itemId, editItem]);

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
    console.group("🟡 HANDLE SAVE START");

    console.log("FORM VALUES", {
      itemId,
      itemName,
      description,
      saleRate,
      discountPct,
      removeImage,
    });

    console.log("UPDATEDON REF BEFORE SAVE", updatedOnRef.current);
    const formErrors = validateItemForm({
      itemName,
      description,
      saleRate,
      discountPct,
    });

    if (Object.keys(formErrors).length > 0) {
      console.warn("❌ FORM VALIDATION FAILED", formErrors);
      setErrors(formErrors);
      console.groupEnd();
      return;
    }

    try {
      setIsSaving(true);

      let savedItemId: number;

      /* ================= ADD MODE ================= */
      if (!itemId) {
        const res = await saveItem({
          itemName: itemName.trim(),
          description: description.trim(),
          salesRate: Number(saleRate),
          discountPct: Number(discountPct),
        }).unwrap();

        console.log("✅ ADD RESPONSE FROM SERVER", res);
        savedItemId = res.primaryKeyID;
      } else {
        /* ================= EDIT MODE ================= */
        // 🔥 STEP 1: fetch latest version JUST before save
        /* ================= EDIT MODE ================= */
        console.log("🟠 EDIT MODE");

        console.log("EDIT ITEM FROM QUERY", editItem);
        console.log("UPDATEDON REF USED IN PAYLOAD", updatedOnRef.current);
        // 🔥 STEP 1: fetch latest version
        const payload: ItemPayload = {
          itemID: itemId,
          itemName: itemName.trim(),
          description: description.trim(),
          salesRate: Number(saleRate),
          discountPct: Number(discountPct),
          updatedOnPrev: updatedOnRef.current!,
          removeImage,
        };

        console.log("📤 SAVE PAYLOAD", payload);

        const res = await saveItem(payload).unwrap();
        console.log("✅ SAVE RESPONSE FROM SERVER", res);

        console.log(
          "🔄 UPDATEDON CHANGE",
          "OLD →",
          updatedOnRef.current,
          "NEW →",
          res.updatedOn,
        );

        // 🔥 UPDATE LOCAL VERSION AFTER SAVE
        updatedOnRef.current = res.updatedOn;

        await refetch(); // 🔥 ADD THIS LINE
        savedItemId = itemId;
      }
      console.log("FINAL ITEM ID FOR UPLOAD:", savedItemId);
      if (typeof savedItemId !== "number") {
        console.error("❌ INVALID SAVED ITEM ID");
        toast.error("Failed to save item. Please try again.");
        console.groupEnd();
        return;
      }
      /* ================= IMAGE UPLOAD ================= */
      if (file && typeof savedItemId === "number") {
        console.log("🖼️ UPLOADING IMAGE");
        await uploadPicture({ id: savedItemId, file }).unwrap();
        console.log("✅ IMAGE UPLOADED");

        // 🔥 REFRESH PICTURE
        setFile(null);
      }

      toast.success(
        itemId ? "Item updated successfully" : "Item added successfully",
      );
      console.log("🟢 SAVE FLOW SUCCESS");
      onClose();
      onSaved();
      resetForm();
      setErrors({});
    } catch (err) {
      const error = err as FetchBaseQueryError;

      console.error("🔥 SAVE FAILED", error);

      console.log("ERROR STATUS", error.status);
      console.log("UPDATEDON REF AT ERROR TIME", updatedOnRef.current);
      console.log("EDIT ITEM AT ERROR TIME", editItem);
      if (error.status === 409) {
        // 🔥 DUPLICATE NAME CASE
        if (!itemId || !editItem) {
          setErrors((prev) => ({
            ...prev,
            itemName: "Name already exists.",
          }));

          toast.error("Duplicate item name not accepted.");
          console.groupEnd();
          return;
        }

        // 🔥 CONCURRENCY CASE (EDIT MODE)
        console.warn("♻️ Auto refetch and retry");

        toast.error("Item updated by another user. Reloading...");
        await refetch();
        onClose();

        console.groupEnd();
        return;
      }

      if (error.status === 412) {
        console.warn("⚠️ 412 PRECONDITION FAILED");
        setConcurrencyError(true);
        console.groupEnd();
        return;
      }

      if (error.status === 413) {
        console.warn("⚠️ 413 PAYLOAD TOO LARGE");
        toast.error("Image size should be less than 2 MB");
        console.groupEnd();
        return;
      }

      console.error("❌ UNKNOWN ERROR", error);
    } finally {
      setIsSaving(false);
      console.groupEnd();
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
        {itemId ? "Edit Item" : "New Item"}
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
              {(file || (itemId && pictureUrl && !removeImage)) && (
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
          disabled={isSaving || (itemId !== null && !editItem)}
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
