import { useState } from "react";
import { Avatar, Button, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface LogoUploadProps {
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
}

export const LogoUpload = ({
  onChange,
  maxSizeMB = 5,
}: LogoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = (file?: File) => {
    if (!file) return;
   
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Logo must be PNG or JPG");
      return;
    }

    if (file.size > maxSizeBytes) {
      setError(`Logo size must be ≤ ${maxSizeMB} MB`);
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const handleDelete = () => {
    setPreview(null);
    setError(null);
    onChange(null); // clear form value
  };

  return (
    <div className="flex items-center gap-4">
      {/* ================= AVATAR ================= */}
      <Avatar
        src={preview ?? undefined}
        alt="Company Logo"
        variant="rounded"
        sx={{
          width: 72,
          height: 72,
          bgcolor: "#f1f1f1",
        }}
      />

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            Upload Logo
            <input
              type="file"
              hidden
              accept="image/png, image/jpeg"
              onChange={(e) =>
                handleFileSelect(e.target.files?.[0])
              }
            />
          </Button>

          {/* DELETE BUTTON (only when logo exists) */}
          {preview && (
            <IconButton
              color="error"
              size="small"
              onClick={handleDelete}
              aria-label="Delete logo"
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </div>

        <Typography variant="caption" color="text.secondary">
          PNG or JPG, up to {maxSizeMB}MB
        </Typography>

        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </div>
    </div>
  );
};
