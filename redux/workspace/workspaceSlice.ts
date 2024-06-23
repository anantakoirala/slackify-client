import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  name: string;
  _id: string;
  coWorkers: { _id: string; username: string }[];
  channels: { _id: string; name: string }[];
  type: string;
};

const initialState: InitialStateType = {
  name: "",
  _id: "",
  coWorkers: [],
  channels: [],
  type: "",
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace: (state, action) => {
      const workspace = action.payload.data.workspace;
      state.name = workspace.name;
      state.channels = workspace.channels;
      state.coWorkers = workspace.coWorkers;
      // console.log("action", action.payload.data.workspace);
    },
  },
});

export const { setWorkspace } = workspaceSlice.actions;
