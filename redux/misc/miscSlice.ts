import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  type: "workspace" | "channel" | "user";
  tid: string;
  huddleShow: boolean;
  huddleOn: boolean;
  huddleUserId: string;
  huddleUserName: string;
  senderUserId: string;
  showSideBar: boolean;
  drawerOpen: boolean;
  huddleSwitchChecked: boolean;
};

const initialState: InitialState = {
  type: "workspace",
  tid: "",
  huddleShow: false,
  huddleOn: false,
  huddleUserId: "",
  huddleUserName: "",
  senderUserId: "",
  showSideBar: true,
  drawerOpen: false,
  huddleSwitchChecked: false,
};

export const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setType: (state, action) => {
      //console.log("payload", action.payload);
      state.type = action.payload;
    },
    setTid: (state, action: PayloadAction<string>) => {
      state.tid = action.payload;
    },
    setHuddleShow: (state, action) => {
      state.huddleShow = action.payload;
    },
    setHuddleOn: (state, action) => {
      state.huddleOn = action.payload;
    },
    setHuddleUserId: (state, action) => {
      state.huddleUserId = action.payload;
    },
    setHuddleUserName: (state, action) => {
      state.huddleUserName = action.payload;
    },
    setSenderUserId: (state, action) => {
      state.senderUserId = action.payload;
    },
    setShowSideBar: (state, action) => {
      state.showSideBar = action.payload;
    },
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    setHuddleSwitchChecked: (state, action) => {
      state.huddleSwitchChecked = action.payload;
    },
  },
});

export const {
  setType,
  setTid,
  setHuddleShow,
  setHuddleOn,
  setHuddleUserId,
  setHuddleUserName,
  setSenderUserId,
  setShowSideBar,
  setDrawerOpen,
  setHuddleSwitchChecked,
} = miscSlice.actions;
