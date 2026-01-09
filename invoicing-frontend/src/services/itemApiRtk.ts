import { baseApi } from "../api/baseQuery";
import type { Item, ItemPayload } from "../types/itemTypes";

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
      Pick<Item, "_id" | "itemName" | "saleRate" | "discountPct">[],
      void
    >({
      query: () => "/Item/GetLookupList",
    }),

    /* ================= INSERT ================= */
    insertItem: builder.mutation<
      { itemID: string; updatedOn: string },
      ItemPayload
    >({
      query: (body) => ({
        url: "/Item",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Item"],
    }),

    /* ================= UPDATE ================= */
    updateItem: builder.mutation<
      { itemID: string; updatedOn: string },
      { id: string; body: ItemPayload & { updatedOnPrev: string } }
    >({
      query: ({ id, body }) => ({
        url: `/Item/${id}`,          // ✅ EXACT MATCH
        method: "PUT",
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
      { ItemName: string; ExcludeID?: string }
    >({
      query: (params) => ({
        url: "/Item/CheckDuplicateItemName",  // ✅ EXACT MATCH
        params,
      }),
    }),

    /* ================= UPLOAD / UPDATE PICTURE ================= */
    uploadItemPicture: builder.mutation<
      { url: string },
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/Item/UpdateItemPicture/${id}`, // ✅ EXACT MATCH
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Item"],
    }),

    /* ================= GET PICTURE ================= */
    getItemPicture: builder.query<{ url: string }, string>({
      query: (id) => `/Item/Picture/${id}`,   // ✅ EXACT MATCH
    }),

    /* ================= GET THUMBNAIL ================= */
    getItemThumbnail: builder.query<{ url: string }, string>({
      query: (id) => `/Item/PictureThumbnail/${id}`, // ✅ EXACT MATCH
    }),
  }),
});

export const {
  useGetItemListQuery,
  useGetItemByIdQuery,
  useGetItemLookupListQuery,
  useInsertItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useCheckDuplicateItemNameQuery,
  useUploadItemPictureMutation,
  useGetItemPictureQuery,
  useGetItemThumbnailQuery,
} = itemApi;
