import { baseApi } from "../api/baseQuery";
import type {  Item, ItemPayload } from "../types/itemTypes";

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
