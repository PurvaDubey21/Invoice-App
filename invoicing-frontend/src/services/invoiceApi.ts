import { baseApi } from "../api/baseQuery";
import type {
  Invoice,
  InvoiceMetrics,
  InvoiceTrend,
  TopItem,
} from "../types/invoice.types";
import type { 
  SaveInvoicePayload, 
  InvoiceApiResponse, 
 SaveInvoiceResponse 
} from "../types/invoiceEditor.types";

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Invoice List
    getInvoiceList: builder.query<Invoice[], { from?: string; to?: string }>({
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
    getTopItems: builder.query<TopItem[], { from: string; to: string }>({
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
    // ✅ Get single invoice (Editor - Edit mode)
    getInvoiceById: builder.query< InvoiceApiResponse,
  { invoiceID: number }
  >({
      query: ({ invoiceID }) => ({
        url: "/invoice/getlist",
        params: { invoiceID },
      }),
      providesTags: ["Invoice"],
    }),

    // ✅ Insert / Update Invoice (Editor Save)
    saveInvoice: builder.mutation<
     SaveInvoiceResponse,   // ✅ API response
     SaveInvoicePayload     // ✅ request body
    >({
      query: (payload) => ({
        url: "/invoice/insertupdate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Invoice"],
    }),
    // ✅ Item dropdown for invoice lines
    
  }),

  overrideExisting: false,
});

export const {
  useGetInvoiceListQuery,
  useGetInvoiceMetricsQuery,
  useGetInvoiceTrend12mQuery,
  useGetTopItemsQuery,
  useDeleteInvoiceMutation,

  // 🔥 Invoice Editor hooks
  useGetInvoiceByIdQuery,
  useSaveInvoiceMutation,
  
} = invoiceApi;
