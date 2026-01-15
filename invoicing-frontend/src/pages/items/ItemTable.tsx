import { useMemo } from "react";
import { getItemColumns } from "./itemColumns";
import type { Item } from "../../types/itemTypes";
import { DataTable } from "../../components/common/DataTable";

interface Props {
  rows: Item[];
  loading: boolean;
  visibleColumns: string[];
  onEditItem: (item: Item) => void;
  onDeleteItem: (id: string) => void;
}

export const ItemTable = ({
  rows,
  loading,
  visibleColumns,
  onEditItem,
  onDeleteItem,
}: Props) => {
   const columnVisibilityModel = useMemo(() => {
  const model: Record<string, boolean> = {};

  getItemColumns(onEditItem, onDeleteItem).forEach((col) => {
    // 👇 FORCE picture + actions to be visible
    if (col.field === "pictureUrl" || col.field === "actions") {
      model[col.field] = true;
    } else {
      model[col.field] = visibleColumns.includes(col.field);
    }
  });

  return model;
}, [visibleColumns, onEditItem, onDeleteItem]);
  return (
    <DataTable
      rows={rows}
      columns={getItemColumns(onEditItem, onDeleteItem)}
      loading={loading}
      height={450}
      getRowId={(row) => row._id}
      columnVisibilityModel={columnVisibilityModel}
      
    />
  );
};
