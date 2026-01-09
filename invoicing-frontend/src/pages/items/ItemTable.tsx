import { DataGrid } from "@mui/x-data-grid";
import { useGetItemListQuery  } from "../../services/itemApiRtk";
import { getItemColumns } from "./itemColumns";
import type{ Item } from "../../types/itemTypes";

interface Props {
  onEditItem: (item: Item) => void;
}

export const ItemTable = ({ onEditItem }: Props) => {
  const { data = [], isLoading } = useGetItemListQuery ({});

  return (
    <DataGrid
      rows={data}
      columns={getItemColumns(onEditItem)}
      loading={isLoading}
      autoHeight
      getRowId={(row) => row._id}
      disableRowSelectionOnClick
    />
  );
};
