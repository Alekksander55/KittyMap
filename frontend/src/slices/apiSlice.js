import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL });

export const apiSliceUser = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});

export const apiSliceMarkers = createApi({
  baseQuery,
  tagTypes: ["Markers"],
  endpoints: (builder) => ({}),
});
