import type {ItemFormValues, ItemFormErrors} from '../types/itemTypes';


export const validateItemForm = (
  values: ItemFormValues
): ItemFormErrors => {
  const errors: ItemFormErrors = {};

  /* ---------- ITEM NAME ---------- */
  const name = values.itemName.trim();
  if (!name) {
    errors.itemName = "Please enter item name.";
  } else if (name.length > 50) {
    errors.itemName = "Max 50 characters allowed.";
  }

  /* ---------- DESCRIPTION ---------- */
  if (values.description.length > 500) {
    errors.description = "Max 500 characters allowed.";
  }

  /* ---------- SALE RATE ---------- */
  if (values.saleRate === "") {
  errors.saleRate = "Enter a valid rate.";
} else {
  const rate = Number(values.saleRate);
  if (isNaN(rate) || rate < 0) {
    errors.saleRate = "Enter a valid rate.";
  }
}
  
 /* ---------- DISCOUNT ---------- */
if (values.discountPct !== "") {
  const discount = Number(values.discountPct);
  if (isNaN(discount) || discount < 0 || discount > 100) {
    errors.discountPct = "0–100 only.";
  }
}  

  return errors;
}