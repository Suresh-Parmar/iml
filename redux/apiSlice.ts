import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import authAPI from "./authAxios";
import endpoints from "./endpoints";
let BASE_URL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosBaseQuery =
  ({ baseUrl }: any = { baseUrl: "" }) =>
  async ({ url, method, body, params }: any) => {
    if (!url.includes("http")) {
      url = baseUrl + url;
    }

    try {
      const result = await authAPI({ url, method, data: body, params });
      return { data: result };
    } catch (err: any) {
      return { data: err.response };
    }
  };

const { NEXT_API, LANDING_API } = endpoints;

export const apiSlice: any = createApi({
  reducerPath: "apiData",
  refetchOnReconnect: true,
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["updateRoles", "countries", "states"],

  endpoints: (builder) => ({
    // locations
    finduserGeoLocation: builder.query({
      query: () => {
        return {
          url: "https://ipapi.co/json",
          method: "get",
        };
      },
    }),

    getAllLocations: builder.query({
      query: (data) => {
        return {
          url: NEXT_API,
          method: "POST",
          body: data,
        };
      },
      providesTags: ["countries", "states"],
    }),

    // locations

    tableDataMatrix: builder.query({
      query: (data) => {
        return {
          url: NEXT_API,
          method: "POST",
          body: data,
        };
      },
      providesTags: ["updateRoles"],
    }),

    roleCrudOpsget: builder.query({
      query: (dataID) => {
        return {
          url: NEXT_API,
          method: "POST",
          body: { collection_name: "rolemappings", filter_var: { name: dataID }, op_name: "find_many" },
        };
      },
      providesTags: ["updateRoles"],
    }),

    roleCrudOpsUpdate: builder.mutation({
      query: () => {
        return {
          url: NEXT_API,
          method: "POST",
        };
      },
      invalidatesTags: ["updateRoles"],
    }),

    landingPageAPis: builder.query({
      query: (data) => {
        return {
          url: LANDING_API,
          method: "POST",
          body: data,
        };
      },
      providesTags: ["updateRoles"],
    }),
  }),
});

export const {
  useFinduserGeoLocationQuery,
  useRoleCrudOpsUpdateMutation,
  useRoleCrudOpsgetQuery,
  useTableDataMatrixQuery,
  useGetAllLocationsQuery,
  useLandingPageAPisQuery,
} = apiSlice;
