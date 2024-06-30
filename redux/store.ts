"use client";
import { configureStore } from "@reduxjs/toolkit";
import { workspaceApi } from "./workspace/workspaceApi";
import { api } from "./api/api";
import { workspaceSlice } from "./workspace/workspaceSlice";
import { miscSlice } from "./misc/miscSlice";
import { chatSlice } from "./chat/chatSlice";
import { channelSlice } from "./channel/channelSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [workspaceSlice.name]: workspaceSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [channelSlice.name]: channelSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat(workspaceApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
