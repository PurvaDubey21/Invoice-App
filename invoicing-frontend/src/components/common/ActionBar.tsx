import { useState } from "react";
import { 
  Box, 
  TextField, 
  Button ,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText, 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import type { ALL_COLUMNS, InvoiceColumnKey } from "../../pages/invoices/invoiceColumns.config";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <TextField
        size="small"
        fullWidth
        placeholder="Search invoice no, customer"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: 450,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            fontSize: 18,
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

      <Box display="flex" gap={1}>
        <Button
         
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log("New Invoice clicked");
            onCreateInvoice();
          }}
            sx={{
            color: "#fff",
            borderColor: "#525355",
            fontWeight: 600,
            backgroundColor: "#525355",
            textTransform: "none",
            "&:hover": {
              borderColor: "#3f4041",
              backgroundColor: "#3f4041",
            },
          }}
         
        >
          New Invoice
        </Button>
        <Button 
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handelExport}
         sx={{
            color: "#525355",
            borderColor: "#525355",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#3f4041",
              backgroundColor: "rgba(82,83,85,0.04)",
            },
          }}
        >
          Export
        </Button>
        <Button  
        variant="outlined"
        startIcon={<ViewColumnIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
         sx={{
            color: "#525355",
            fontWeight: 600,
            borderColor: "#525355",
            textTransform: "none",
            "&:hover": {
              borderColor: "#3f4041",
              backgroundColor: "rgba(82,83,85,0.04)",
            },
          }}
        >
          Columns
        </Button>

         <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          {columns.map((col) => (
            <MenuItem
              key={col.key}
              onClick={() => onToggleColumn(col.key)}
            >
              <Checkbox checked={visibleColumns.includes(col.key)} />
              <ListItemText primary={col.label} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};
