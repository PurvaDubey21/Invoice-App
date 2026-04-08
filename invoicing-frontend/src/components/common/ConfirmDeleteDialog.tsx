import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmDeleteDialog = ({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
  loading = false,
}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          width: 380,
        },
      }}
    >
      {/* 🔶 Warning Icon Top Center */}
      <Box
        display="flex"
        justifyContent="center"
        mt={2}
      >
        <Box
          sx={{
            bgcolor: "#fff4e5",
            borderRadius: "50%",
            p: 2,
          }}
        >
          <WarningAmberRoundedIcon
            sx={{ color: "#f59e0b", fontSize: 40 }}
          />
        </Box>
      </Box>

      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 22,
          mt: 1,
        }}
      >
        {title}
      </DialogTitle>

      {/* Message */}
      <DialogContent>
        <Typography
          textAlign="center"
          color="text.secondary"
          fontSize={15}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          pb: 3,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
