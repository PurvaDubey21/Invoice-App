import { Box, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

export const ActionBar = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <TextField
        size="small"
        sx={{width:"350px"}}
        placeholder="Search invoice no, customer"
      />

      <Box display="flex" gap={1}>
        <Button size="small" variant="contained" startIcon={<AddIcon />}>
          New Invoice
        </Button>
        <Button size="small" startIcon={<UploadIcon />}>
          Export
        </Button>
        <Button size="small" startIcon={<ViewColumnIcon />}>
          Columns
        </Button>
      </Box>
    </Box>
  );
};
