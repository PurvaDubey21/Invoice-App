export interface Item {
  _id: string;
  companyID: string;
  itemName: string;
  description?: string | null;
  saleRate: number;
  discountPct: number;
  pictureUrl?: string;
  thumbnailUrl?: string;
  createdOn: string;
  updatedOn: string;
}

export interface ItemPayload {
  itemName: string;
  description?: string | null;
  saleRate: number;
  discountPct: number;
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