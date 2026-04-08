import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    // 🔑 JWT attach to every request
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },

    // ❌ DO NOT use credentials: 'include'
    // credentials: 'include',  <-- intentionally removed
  }),
  tagTypes: ["Item", "Invoice", "Auth"],
  endpoints: () => ({}),
});
