import React, { useState } from "react";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Popover,
  TextField,
  Stack,
} from "@mui/material";

const filters = [
  { label: "Today", value: "today" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 12 Months", value: "12m" },
  { label: "Custom", value: "custom" },
];
export const PageHeader = ({
  title,
  value,
  selectedRange,
  onChange,
}: {
  title: string;
  value: string;
  selectedRange?: { from: string; to: string } | null;
  onChange: (payload: { period: string; from?: string; to?: string }) => void; // ✅ FIXED
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClick = (val: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (val === "custom") {
      setAnchorEl(e.currentTarget);
    } else {
      onChange({ period: val });
    }
  };

  const handleApplyCustomRange = () => {
    if (!fromDate || !toDate) return;

    // ❌ invalid range block
    if (fromDate > toDate) return;

    onChange({
      period: "custom",
      from: fromDate,
      to: toDate,
    });
    // ✅ clear dates after apply
    setFromDate("");
    setToDate("");

    // close popover
    setAnchorEl(null);
  };

  return (

    <Box
     sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={2}
      px={6}
     
    >
      {/* LEFT: TITLE */}
      <Typography fontSize={24} fontWeight={600} color="#535255">
        {title}
      </Typography>

      {/* RIGHT: FILTER BUTTONS */}
      {/* RIGHT: FILTER BUTTONS */}
      <Box display="flex" alignItems="center">
        <ButtonGroup
          variant="outlined"
          sx={{
            "& .MuiButton-root": {
              borderRadius: "999px",
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "4px 14px",
              borderColor: "#d1d2d4",
              ml: 2,
            },
          }}
        >
          {filters.map((f) => (
            <Button
              key={f.value}
              onClick={(e) => handleClick(f.value, e)}
              sx={{
                backgroundColor: value === f.value ? "#525355" : "transparent",
                color: value === f.value ? "#fff" : "#525355",
                "&:hover": {
                  backgroundColor: value === f.value ? "#424244" : "#f0f1f2",
                },
              }}
            >
              {f.label}
            </Button>
          ))}
        </ButtonGroup>

        {value === "custom" && selectedRange && (
          <Typography fontSize={12} color="#777" sx={{ ml: 2, mt: 0.5 }}>
            {selectedRange.from} → {selectedRange.to}
          </Typography>
        )}

        {/* ✅ SINGLE Popover (NOT inside map) */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Box p={2} minWidth={260}>
            <Stack spacing={2}>
              <TextField
                label="From"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <TextField
                label="To"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={handleApplyCustomRange}
                disabled={!fromDate || !toDate}
              >
                Apply
              </Button>
            </Stack>
          </Box>
        </Popover>
      </Box>
    </Box>
    </Box>
  );
};
