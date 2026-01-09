export interface Item {
  _id: string;
  companyID: string;
  itemName: string;
  description?: string | null;
  saleRate: number;
  discountPct: number;
  pictureUrl?: string;
  createdOn: string;
  updatedOn: string;
}

export interface ItemPayload {
  itemName: string;
  description?: string | null;
  saleRate: number;
  discountPct: number;
}
