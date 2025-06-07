import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";

import authReducer from "./features/authSlice";
import themeReducer from "./features/themeSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { createFilter } from "redux-persist-transform-filter";

const authFilter = createFilter("auth", ["userInfo"]);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme"],
  transforms: [authFilter],
};

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);
export default store;
