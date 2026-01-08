import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

export const DataTable = ({
  rows,
  columns,
  loading,
}: {
  rows: Record<string, unknown>[];
  columns: GridColDef[];
  loading: boolean;
}) => {
  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      loading={loading}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
      sx={{
        border: "none",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#f5f6f7",
        },
      }}
    />
  );
};
