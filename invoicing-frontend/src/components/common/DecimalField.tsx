import React from "react";
import  { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

interface DecimalFieldProps extends Omit<TextFieldProps, "onChange"> {
  value: number | "";
  onValueChange: (value: number) => void;
}

const DecimalField: React.FC<DecimalFieldProps> = ({
  value,
  onValueChange,
  ...rest
}) => {
  const [input, setInput] = React.useState<string>("");

  // sync external value
  React.useEffect(() => {
    setInput(value === "" || value === 0 ? "" : String(value));
  }, [value]);

  return (
    <TextField
      {...rest}
      type="text"
      value={input}
      inputProps={{ inputMode: "decimal" }}
      onChange={(e) => {
        const val = e.target.value;

        // allow only decimals
        if (/^\d*\.?\d*$/.test(val)) {
          setInput(val);
        }
      }}
      onBlur={() => {
        const num = Number(input) || 0;
        onValueChange(num);
      }}
    />
  );
};

export default DecimalField;
