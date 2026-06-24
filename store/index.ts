import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/store/api/baseApi";
import { authPersistMiddleware } from "@/store/auth-persist-middleware";
import { mutationToastMiddleware } from "@/store/mutation-toast-middleware";
import "@/store/api/portfolioApi";
import authReducer from "@/store/slices/authSlice";
import preferencesReducer from "@/store/slices/preferencesSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      preferences: preferencesReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        baseApi.middleware,
        authPersistMiddleware,
        mutationToastMiddleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
