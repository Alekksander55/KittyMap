import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  //add
  credentials: "include",
});

// add
const extraOptions = {
  // Add withCredentials property to all mutations
  mutate: (args, api, extra) => {
    if (extra.withCredentials) {
      args.credentials = "include";
    }
    return baseQuery(args, api, extra);
  },
};

export const apiSliceUser = createApi({
  baseQuery,
  // add
  extraOptions,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});

export const apiSliceMarkers = createApi({
  baseQuery,
  // add
  extraOptions,
  tagTypes: ["Markers"],
  endpoints: (builder) => ({}),
});
