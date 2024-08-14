import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  organizationId: string;
  typeId: string;
  videoChatId: string;
  videoChatmembers: { _id: string; username: string }[];
};

const initialState: InitialState = {
  organizationId: "",
  typeId: "",
  videoChatId: "",
  videoChatmembers: [],
};

export const videoChatSlice = createSlice({
  name: "videochat",
  initialState,
  reducers: {
    setOrganizationId: (state, action) => {
      state.organizationId = action.payload;
    },
    setTypeId: (state, action) => {
      state.typeId = action.payload;
    },
    setVideoChatId: (state, action) => {
      state.videoChatId = action.payload;
    },
    setVideoChatMembers: (state, action) => {
      state.videoChatmembers = action.payload;
    },
  },
});

export const {
  setOrganizationId,
  setTypeId,
  setVideoChatId,
  setVideoChatMembers,
} = videoChatSlice.actions;
