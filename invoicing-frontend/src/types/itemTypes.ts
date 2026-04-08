export interface Item {
  itemID: number;
  companyID: number;
  itemName: string;
  description?: string | null;
  salesRate: number;
  discountPct: number;
  pictureUrl?: string;
  thumbnailUrl?: string;
  createdOn: string;
  updatedOn: string;
}

// INSERT payload (NO itemID, NO updatedOnPrev)
export interface ItemPayload {
   itemID?: number;
  itemName: string;
  description?: string;
  salesRate: number;
  discountPct: number;
  updatedOnPrev?: string;
  removeImage?: boolean;
}

// vlidation form type
 export type ItemFormValues = {
  itemName: string;
  description: string;
  saleRate: string;
  discountPct: string;
};

export type ItemFormErrors = {
  itemName?: string;
  saleRate?: string;
  discountPct?: string;
  description?: string;
};