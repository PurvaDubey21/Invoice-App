import { DataGrid } from "@mui/x-data-grid";
import { useGetItemsQuery } from "../../services/itemApiRtk";
import { columns } from "../items/itemColumns";

export const ItemTable = () => {
  const { data = [], isLoading } = useGetItemsQuery({});

  return (
    <DataGrid
      rows={data}
      columns={columns}
      loading={isLoading}
      autoHeight
      getRowId={(row) => row.itemID}
      pageSizeOptions={[10, 25, 50]}
      disableRowSelectionOnClick
    />
  );
};
