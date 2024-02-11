import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import { apiSliceMarkers, apiSliceUser } from "./slices/apiSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSliceUser.reducerPath]: apiSliceUser.reducer,
    [apiSliceMarkers.reducerPath]: apiSliceMarkers.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSliceUser.middleware),
  devTools: true,
});

export default store;
