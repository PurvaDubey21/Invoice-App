import { baseApi } from "../api/baseQuery";

export interface MeResponse {
  userID: number;
  companyID: number;
  email: string;
  firstName?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ SESSION CHECK
    getMe: builder.query<MeResponse, void>({
      query: () => "/Auth/Me",
      providesTags: ["Auth"],
    }),

    // ✅ LOGOUT
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/Auth/Logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
