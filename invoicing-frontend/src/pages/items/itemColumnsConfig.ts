import type { Item } from "../../types/itemTypes";

type ItemField = keyof Item;

export interface ItemColumnConfig {
  field: ItemField | "actions" | "pictureUrl";
  label: string;
  exportable: boolean;
  defaultVisible: boolean;
}

export const ITEM_COLUMNS_CONFIG: ItemColumnConfig[] = [
  {
    field: "itemName",
    label: "Item Name",
    exportable: true,
    defaultVisible: true,
  },
  {
    field: "description",
    label: "Description",
    exportable: true,
    defaultVisible: true,
  },
  {
    field: "salesRate",
    label: "Sale Rate",
    exportable: true,
    defaultVisible: true,
  },
  {
    field: "discountPct",
    label: "Discount %",
    exportable: true,
    defaultVisible: true,
  },
  {
    field: "pictureUrl",
    label: "Picture",
    exportable: false,
    defaultVisible: true,
  },
  {
    field: "actions",
    label: "Actions",
    exportable: false,
    defaultVisible: true,
  },
];
