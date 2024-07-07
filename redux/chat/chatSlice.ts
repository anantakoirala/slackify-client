import { createSlice } from "@reduxjs/toolkit";

type chatInitialStateSchema = {
  chatId: string;
  members: { _id: string; username: string }[];
  name: string;
};

const initialState: chatInitialStateSchema = {
  chatId: "",
  members: [],
  name: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload.data.chat._id;
    },
    setChatMembers: (state, action) => {
      //console.log("nenene", action.payload.data.chat.collaborators);
      state.members = action.payload.data.chat.collaborators;
    },
    setName: (state, action) => {
      state.name = action.payload.data.chat.name;
    },
  },
});

export const { setChatId, setChatMembers, setName } = chatSlice.actions;
