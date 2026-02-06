import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { NoRowsOverlay } from "./NoRowsOverlay";
interface DataTableProps<T> {
  rows: T[];
  columns: GridColDef[];
  loading: boolean;
  height?: number;
  getRowId: (row: T) => string | number;
  columnVisibilityModel?: Record<string, boolean>;
  
}

export const DataTable = <T,>({
  rows,
  columns,
  loading,
  getRowId,
  columnVisibilityModel,
  height = 350,

  
}: DataTableProps<T>) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        height,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        hideFooter
        rowHeight={68}
        disableRowSelectionOnClick
        // 👇 FORWARD TO MUI GRID
        columnVisibilityModel={columnVisibilityModel}
        
        slots={{
          noRowsOverlay: () => <NoRowsOverlay message="No items found" />,
        }}
        sx={{
          border: "none",
          height: "100%",

          /* 🔹 HEADER CONTAINER */
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f6f7f8",
            borderBottom: "1px solid #e5e7eb",
        
          },

          /* 🔹 HEADER CELL (PADDING + TEXT) */
          "& .MuiDataGrid-columnHeader": {
            padding: "12px 16px",
            fontSize: 16,
            color: "#525355",
            backgroundColor: "#f6f7f8",
          },

          /* 🔹 ROW DIVIDER */
          "& .MuiDataGrid-row": {
            borderBottom: "1px solid #f1f1f1",
          },

          /* 🔹 CELL (ACTUAL CONTENT PADDING) */
          "& .MuiDataGrid-cell": {
           display: "flex",
            alignItems: "center",
            fontSize: 16,
            color: "#525355",
            borderBottom: "none",
          },

          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto",
          },
        }}
      />
    </div>
  );
};
