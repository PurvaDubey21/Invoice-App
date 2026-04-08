import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Popover,
  TextField,
  Stack,
  useMediaQuery,
  IconButton,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

const filters = [
  { label: "Today", value: "today" },
  { label: "This Month", value: "month" },
  { label: "Last Month", value: "last-month" },
  { label: "Last 12 Months", value: "12m" },
  { label: "Custom", value: "custom" },
];

export const PageHeader = ({
  title = "Invoices",
  value,
  selectedRange,
  onChange,
  onMenuClick,
}: {
  title?: string;
  value: string;
  selectedRange?: { from: string; to: string } | null;
  onChange: (payload: { period: string; from?: string; to?: string }) => void;
  onMenuClick?: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    if (fromDate > toDate) return;

    onChange({
      period: "custom",
      from: fromDate,
      to: toDate,
    });

    setFromDate("");
    setToDate("");
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
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        spacing={isMobile ? 1.5 : 0}
        py={{ xs: 2, md: 1 }}
        px={{ xs: 2, md: 6 }}
      >
        {/* TITLE + HAMBURGER */}
        <Box display="flex" alignItems="center" gap={1}>
          {isMobile && (
            <IconButton onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            fontSize={{ xs: 18, md: 24 }}
            fontWeight={600}
            color="#535255"
          >
            {title}
          </Typography>
        </Box>

        {/* FILTERS */}
        <Stack spacing={1} width="100%">
          <Box
            display="flex"
            flexWrap="wrap"
            gap={1}
            justifyContent={isMobile ? "flex-start" : "flex-end"}
          >
            {filters.map((f) => (
              <Button
                key={f.value}
                onClick={(e) => handleClick(f.value, e)}
                size="small"
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  border: "1px solid #d1d2d4",
                  backgroundColor:
                    value === f.value ? "#525355" : "transparent",
                  color: value === f.value ? "#fff" : "#525355",
                  "&:hover": {
                    backgroundColor:
                      value === f.value ? "#424244" : "#f0f1f2",
                  },
                }}
              >
                {f.label}
              </Button>
            ))}
          </Box>

          {value === "custom" && selectedRange && (
            <Typography fontSize={12} color="#777">
              {selectedRange.from} → {selectedRange.to}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* DATE POPOVER */}
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
  );
};
