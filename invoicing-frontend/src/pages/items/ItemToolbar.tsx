import {
  Box,
  Button,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
// import { Search } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

interface Props {
  onAddItem: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onOpenColumnChooser: () => void;
  // 🔍 Search props
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const ItemToolbar = ({
  onAddItem,
  onExportCsv,
  onExportExcel,
  onOpenColumnChooser,
  searchValue,
  onSearchChange,
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  const open = Boolean(exportAnchor);

  const handleExportClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setExportAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setExportAnchor(null);
  };
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent={{ xs: "flex-start", sm: "space-between" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        px: 6,
        py: 2,
      }}
    >
      <TextField
        size="small"
        placeholder="Search items"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "450px" },
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
      <Stack
          direction="row"
          spacing={1}
          width={isMobile ? "100%" : "auto"}
        >
      <Box
        display="flex"
        gap={1}
        flexWrap="wrap"
        justifyContent={{ xs: "flex-start", sm: "flex-end" }}
      >
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={onAddItem}
          sx={{
            color: "#fff",
            borderColor: "#525355",
            backgroundColor: "#525355",
            textTransform: "none",
            "&:hover": {
              borderColor: "#3f4041",
              backgroundColor: "#3f4041",
            },
          }}
        >
          Add New Item
        </Button>
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleExportClick}
          sx={{
            color: "#525355",
            borderColor: "#525355",
            textTransform: "none",
            "&:hover": {
              borderColor: "#3f4041",
              backgroundColor: "rgba(82,83,85,0.04)",
            },
          }}
        >
          Export
        </Button>
        <Menu anchorEl={exportAnchor} open={open} onClose={handleClose}>
          <MenuItem
            onClick={() => {
              onExportCsv();
              handleClose();
            }}
          >
            Export as CSV
          </MenuItem>

          <MenuItem
            onClick={() => {
              onExportExcel();
              handleClose();
            }}
          >
            Export as Excel
          </MenuItem>
        </Menu>
        <IconButton onClick={onOpenColumnChooser}>
          <ViewColumnIcon />
        </IconButton>
      </Box>
      </Stack>
    </Box>
  );
};
