import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  membersNotInchannel: { _id: string; email: string; username: string }[];
};

const initialState: InitialStateType = {
  membersNotInchannel: [],
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setMembersNotInChannel: (state, action) => {
      state.membersNotInchannel = action.payload.data.usersNotInChannel;
    },
  },
});

export const { setMembersNotInChannel } = channelSlice.actions;
