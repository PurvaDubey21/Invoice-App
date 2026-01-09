import { baseApi } from "../api/baseQuery";
import type {
  Invoice,
  InvoiceMetrics,
  InvoiceTrend,
  TopItem,
} from "../types/invoice.types";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Invoice List
    getInvoiceList: builder.query<
      Invoice[],
      { from?: string; to?: string }
    >({
      query: (range) => ({
        url: "/invoice/getlist",
        params: range,
      }),
      providesTags: ["Invoice"],
    }),

    // ✅ KPI Metrics
    getInvoiceMetrics: builder.query<
      InvoiceMetrics,
      { from: string; to: string }
    >({
      query: (range) => ({
        url: "/invoice/getmetrics",
        params: range,
      }),
    }),

    // ✅ 12 Month Trend
    getInvoiceTrend12m: builder.query<InvoiceTrend[], void>({
      query: () => "/invoice/gettrend12m",
    }),

    // ✅ Top Items
    getTopItems: builder.query<
      TopItem[],
      { from: string; to: string }
    >({
      query: (range) => ({
        url: "/invoice/topitems",
        params: range,
      }),
    }),

    // ✅ Delete Invoice
    deleteInvoice: builder.mutation<void, number>({
      query: (invoiceID) => ({
        url: "/invoice/delete",
        method: "POST",
        body: { invoiceID },
      }),
      invalidatesTags: ["Invoice"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetInvoiceListQuery,
  useGetInvoiceMetricsQuery,
  useGetInvoiceTrend12mQuery,
  useGetTopItemsQuery,
  useDeleteInvoiceMutation,
} = invoiceApi;
