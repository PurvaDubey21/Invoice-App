import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";

import type { ALL_COLUMNS, InvoiceColumnKey } from "../../pages/invoices/invoiceColumns.config";

type ActionBarProps = {
  onCreateInvoice: () => void;
  searchText: string;
  columns: typeof ALL_COLUMNS;
  visibleColumns: string[];
  handelExport: () => void;
  onToggleColumn: (key: InvoiceColumnKey) => void;
  onSearchChange: (value: string) => void;
};

export const ActionBar = ({
  onCreateInvoice,
  searchText,
  columns,
  visibleColumns,
  onSearchChange,
  handelExport,
  onToggleColumn,
}: ActionBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

 return (
  <Box
    display="flex"
    flexDirection={{ xs: "column", sm: "row" }}
    alignItems="center"
    justifyContent="space-between"
    gap={2}
    mb={2}
  >
    {/* 🔍 SEARCH */}
    <TextField
      size="small"
      placeholder="Search invoice no, customer"
      value={searchText}
      onChange={(e) => onSearchChange(e.target.value)}
      fullWidth={isMobile}
      sx={{
        width: { xs: "100%", sm: 450 },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          fontSize: 16,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "#9ca3af" }} />
          </InputAdornment>
        ),
      }}
    />

    {/* 🔘 BUTTONS */}
    <Box
      display="flex"
      gap={1}
      width={{ xs: "100%", sm: "auto" }}
      justifyContent={{ xs: "space-between", sm: "flex-end" }}
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="small"
        onClick={onCreateInvoice}
        sx={{
          flex: { xs: 1, sm: "unset" },
          backgroundColor: "#525355",
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        New Invoice
      </Button>

      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        size="small"
        onClick={handelExport}
        sx={{
          flex: { xs: 1, sm: "unset" },
          borderColor: "#525355",
          color: "#525355",
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Export
      </Button>

      <Button
        variant="outlined"
        startIcon={<ViewColumnIcon />}
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          flex: { xs: 1, sm: "unset" },
          borderColor: "#525355",
          color: "#525355",
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Columns
      </Button>
    </Box>

    {/* 📋 MENU */}
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={() => setAnchorEl(null)}
    >
      {columns.map((col) => (
        <MenuItem key={col.key} onClick={() => onToggleColumn(col.key)}>
          <Checkbox checked={visibleColumns.includes(col.key)} />
          <ListItemText primary={col.label} />
        </MenuItem>
      ))}
    </Menu>
  </Box>
);

};
