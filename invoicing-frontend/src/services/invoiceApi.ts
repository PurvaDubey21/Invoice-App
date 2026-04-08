import { baseApi } from "../api/baseQuery";
import { toast } from "react-toastify";
import type {
  Invoice,
  InvoiceMetrics,
  InvoiceTrend,
  TopItem,
} from "../types/invoice.types";
import type {
  SaveInvoicePayload,
  InvoiceApiResponse,
  SaveInvoiceResponse,
} from "../types/invoiceEditor.types";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const handleErrorToast = (err: unknown) => {
  const error = err as { error?: FetchBaseQueryError };
  const status = error?.error?.status;

  if (status === 400) {
    toast.error("Invoice number already exists.");
  } else if (status === 409) {
    toast.error("Invoice changed. Reload.");
  } else if (status === 500) {
    toast.error("Server error. Try again later.");
  } else if (status === "FETCH_ERROR") {
    toast.error("Network error. Check connection.");
  } else {
    toast.error("Something went wrong.");
  }
};

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Invoice List
    getInvoiceList: builder.query<Invoice[], { from?: string; to?: string }>({
      query: (range) => ({
        url: "/Invoice/GetList",
        params: range,
      }),
      providesTags: ["Invoice"],
    }),

    // ✅ KPI Metrics
    getInvoiceMetrics: builder.query<
      InvoiceMetrics,
      { from: string; to: string }
    >({
      query: ({from, to}) => ({
        url: "/Invoice/GetMetrices",
        params: { from, to },
      }),
      // 🔥 THIS IS THE KEY FIX
  transformResponse: (response: InvoiceMetrics[]) => response[0],
    }),

    // ✅ 12 Month Invoice Trend (as of date)
    getInvoiceTrend12m: builder.query<InvoiceTrend[], { asOf: string }>({
      query: ({ asOf }) => ({
        url: "/Invoice/GetTrend12m",
        params: { asOf },
      }),
    }),

    // ✅ Top Items (Dashboard)
    getTopItems: builder.query<TopItem[], { topN: number }>({
      query: ({ topN }) => ({
        url: "/Invoice/TopItems",
        params: { topN },
      }),
    }),

    deleteInvoice: builder.mutation<void, number>({
      query: (invoiceID) => ({
        url: `/Invoice/${invoiceID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice"],
      async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Invoice deleted successfully");
    } catch (err) {
      handleErrorToast(err);
    }
  },
    }),
    // ✅ Get single invoice by ID (Editor - Edit mode)
    getInvoiceById: builder.query<InvoiceApiResponse, number>({
      query: (invoiceID) => ({
        url: `/Invoice/${invoiceID}`,
        method: "GET",
      }),
      providesTags: ["Invoice"],
    }),

    insertInvoice: builder.mutation<SaveInvoiceResponse, SaveInvoicePayload>({
      query: (payload) => ({
        url: "/Invoice",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Invoice"],
      async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Invoice saved successfully");
    } catch (err) {
      handleErrorToast(err); // ✅ THIS LINE FIXES ESLINT
    }
  },
    }),

    updateInvoice: builder.mutation<SaveInvoiceResponse, SaveInvoicePayload>({
      query: (payload) => ({
        url: "/Invoice",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Invoice"],

      async onQueryStarted(_, { queryFulfilled }) {
    try {
      await queryFulfilled;
      toast.success("Invoice updated successfully");
    } catch (err) {
      handleErrorToast(err); // ✅ required
    }
  },
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

  // 🔥 Invoice Editor hooks
  useGetInvoiceByIdQuery,
  useInsertInvoiceMutation,
  useUpdateInvoiceMutation,
} = invoiceApi;
