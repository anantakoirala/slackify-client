"use client";
import { configureStore } from "@reduxjs/toolkit";
import { workspaceApi } from "./workspace/workspaceApi";
import { api } from "./api/api";
import { workspaceSlice } from "./workspace/workspaceSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [workspaceSlice.name]: workspaceSlice.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(workspaceApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
