import { apiSliceMarkers } from "./apiSlice.js";
const MARKERS_URL = "markers";

export const markersApiSlice = apiSliceMarkers.injectEndpoints({
  endpoints: (builder) => ({
    getMarkers: builder.query({
      query: () => ({
        url: `${MARKERS_URL}`,
        method: "GET",
      }),
    }),
    addMarker: builder.mutation({
        query: (data) => ({
          url: `${MARKERS_URL}/add`,
          method: "POST",
          body: data,
        }),
      }),
      delMarker: builder.mutation({
        query: (id) => ({
          url: `${MARKERS_URL}/${id}`,
          method: "DELETE",
        }),
      }),
      updateMarker: builder.mutation({
        query: ({id, data}) => ({
          url: `${MARKERS_URL}/${id}`,
          method: "PUT",
          body: data,
        }),
      }),
  }),
});

export const { useLazyGetMarkersQuery, useAddMarkerMutation, useDelMarkerMutation, useUpdateMarkerMutation } = markersApiSlice;
