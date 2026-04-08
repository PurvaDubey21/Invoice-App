import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface Column<T extends string> {
  field: T;
  label: string;
}

interface Props<T extends string> {
  open: boolean;
  columns: Column<T>[];
  visibleColumns: T[];
  onChange: (cols: T[]) => void;
  onClose: () => void;
}

export const ColumnChooser = <T extends string>({
  open,
  columns,
  visibleColumns,
  onChange,
  onClose,
}: Props<T>) => {
  const toggleColumn = (field: T) => {
    if (visibleColumns.includes(field)) {
      onChange(visibleColumns.filter((c) => c !== field));
    } else {
      onChange([...visibleColumns, field]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Choose Columns</DialogTitle>

      <DialogContent>
        <FormGroup>
          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={visibleColumns.includes(col.field)}
                  onChange={() => toggleColumn(col.field)}
                />
              }
              label={col.label}
            />
          ))}
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
