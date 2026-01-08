import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import type {
  FieldError,
  UseFormRegisterReturn,
} from "react-hook-form";

/* =========================
   PROPS TYPE
   ========================= */
interface PasswordFieldProps {
  field: UseFormRegisterReturn;
  error?: FieldError;
  value?: string;
}

/* =========================
   COMPONENT
   ========================= */
export const PasswordField = ({ field, error, value }: PasswordFieldProps) => {
  const [show, setShow] = useState(false);

  // simple strength logic (UI-only)
  const strength = Math.min((value?.length ?? 0) * 10, 100);
  return (
    <div>
      <TextField
        size="small"
        {...field}
        type={show ? "text" : "password"}
        label="Password *"
        fullWidth
        error={!!error}
        helperText={error?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((prev) => !prev)}
                edge="end"
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LinearProgress
        variant="determinate"
        value={strength}
        className="mt-1"
      />
    </div>
  );
};
