import { Box, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  onAddItem: () => void;
}

export const ItemToolbar = ({ onAddItem }: Props) => {
  return (
    <Box display="flex" justifyContent="space-between" mb={2}>
      <TextField
        size="small"
        placeholder="Search items"
        sx={{ width: 300 }}
      />

      <Box display="flex" gap={1}>
        <Button 
        startIcon={<AddIcon />} 
        variant="contained"
        onClick={onAddItem}
        >
          Add New Item
        </Button>
        <Button variant="outlined">Export</Button>
        <Button variant="outlined">Columns</Button>
      </Box>
    </Box>
  );
};
