import { baseApi } from "../api/baseQuery";

export const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getItems: builder.query({
      query: () => "/item/getlist",
      providesTags: ["Item"],
    }),

    insertUpdateItem: builder.mutation({
      query: (body) => ({
        url: "/item/insertupdate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Item"],
    }),

    deleteItem: builder.mutation({
      query: (itemID) => ({
        url: "/item/delete",
        method: "POST",
        body: { itemID },
      }),
      invalidatesTags: ["Item"],
    }),

  }),
});

export const {
  useGetItemsQuery,
  useInsertUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;