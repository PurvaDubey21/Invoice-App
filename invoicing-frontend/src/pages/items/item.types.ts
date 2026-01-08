export interface Item {
  _id: string;
  itemName: string;
  description?: string;
  saleRate: number;
  discountPct: number;
  companyID: number;
  createdOn: string;
  updatedOn: string;
}
