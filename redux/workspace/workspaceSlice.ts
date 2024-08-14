import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  name: string;
  _id: string;
  coWorkers: { _id: string; username: string }[];
  channels: { _id: string; name: string }[];
  type: string;
  myWorkspaces: { _id: string; name: string; coWorkers: string[] }[];
};

const initialState: InitialStateType = {
  name: "",
  _id: "",
  coWorkers: [],
  channels: [],
  type: "",
  myWorkspaces: [],
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
      state._id = workspace._id;
      // console.log("action", action.payload.data.workspace);
    },
    setMyWorkspaces: (state, action) => {
      const myWorkspaces = action.payload;
      state.myWorkspaces = myWorkspaces;
    },
  },
});

export const { setWorkspace, setMyWorkspaces } = workspaceSlice.actions;
