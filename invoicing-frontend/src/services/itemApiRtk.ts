import { baseApi } from "../api/baseQuery";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {  Item, ItemPayload } from "../types/itemTypes";
import { toast } from "react-toastify";


const handleItemError = (err: unknown) => {
  const error = err as { error?: FetchBaseQueryError };
  const status = error?.error?.status;

  if (status === 409) {
    toast.error("Record already modified by another user");
  } 
  else if (status === 412) {
    toast.error("Item updated by another user.");
  } 
  else if (status === 413) {
    toast.error("Image size should be less than 2 MB");
  } 
  else if (status === 400) {
    toast.error("Validation error.");
  } 
  else if (status === 500) {
    toast.error("Server error.");
  }
  else {
    toast.error("Something went wrong.");
  }
};


export const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= GET LIST ================= */
    getItemList: builder.query<Item[], { itemID?: string } | void>({
      query: (params) => ({
        url: "/Item/getlist",
        params: params || undefined,
      }),
      providesTags: ["Item"],
    }),

    /* ================= GET BY ID ================= */
    getItemById: builder.query<Item, string>({
      query: (id) => `/Item/${id}`,
    }),

    /* ================= LOOKUP LIST ================= */
    getItemLookupList: builder.query<
      Pick<Item, "itemID" | "itemName">[],
      void
    >({
      query: () => "/Item/GetLookupList",
      providesTags: ["Item"],
    }),

   /* ================= SAVE (INSERT + UPDATE) ================= */
saveItem: builder.mutation<
  { primaryKeyID: number; updatedOn: string },
   ItemPayload
>({
  query: (body) => ({
    url: "/Item",              // ✅ BACKEND EXACT MATCH
    method: "POST",            // ✅ BACKEND RULE
    body,
  }),
  invalidatesTags: ["Item"],
  async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Item saved successfully");
    } catch (err) {
      handleItemError(err);
    }
  },
}),

    /* ================= DELETE ================= */
    deleteItem: builder.mutation<
      { ok: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/Item/${id}`,          // ✅ EXACT MATCH
        method: "DELETE",
      }),
      invalidatesTags: ["Item"],

      async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Item deleted successfully");
    } catch (err) {
      handleItemError(err);
    }
  },
    }),

    /* ================= DUPLICATE NAME CHECK ================= */
    checkDuplicateItemName: builder.query<
      { exists: boolean },
      { ItemName: string; ExcludeID?: number }
    >({
      query: (params) => ({
        url: "/Item/CheckDuplicateItemName",  // ✅ EXACT MATCH
        params,
      }),
    }),

    /* ================= UPLOAD / UPDATE PICTURE ================= */
    uploadItemPicture: builder.mutation<
      { url: string },
      { id: number; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("ItemID", String(id));
        formData.append("file", file);
        

        return {
          url: `/Item/UpdateItemPicture`, // ✅ EXACT MATCH
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Item"],
      async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Image uploaded");
    } catch (err) {
      handleItemError(err);
    }
  },
    }),

    /* ================= GET PICTURE ================= */
    getItemPicture: builder.query<{ url: string }, number>({
      query: (id) => `/Item/Picture/${id}`,   // ✅ EXACT MATCH
    }),

    /* ================= GET THUMBNAIL ================= */
    getItemThumbnail: builder.query< string, number>({
      query: (id) => `/Item/PictureThumbnail/${id}`, // ✅ EXACT MATCH
    }),
  }),
});

export const {
  useGetItemListQuery,
  useGetItemByIdQuery,
  useLazyGetItemByIdQuery,
  useGetItemLookupListQuery,
  useSaveItemMutation,
  useDeleteItemMutation,
  useCheckDuplicateItemNameQuery,
   // 🔥 BOTH hooks
  useLazyCheckDuplicateItemNameQuery,
  useUploadItemPictureMutation,
  useGetItemPictureQuery,
  useGetItemThumbnailQuery,
} = itemApi;
