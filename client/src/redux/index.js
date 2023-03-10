

import { configureStore } from "@reduxjs/toolkit";
import { brApi } from "./services";
import { reducers } from "./slices"

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [brApi.reducerPath]: brApi.reducer,
        ...reducers
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(brApi.middleware),
})