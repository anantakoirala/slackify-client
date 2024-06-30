import { api } from "../api/api";
import { setMembersNotInChannel } from "./channelSlice";

const channelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChannelUser: builder.mutation({
      query: (data) => ({
        url: "/api/v1/channel/get-channel-user",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //console.log("result", result);
          dispatch(setMembersNotInChannel(result));
        } catch (error) {}
      },
    }),
    addMembersToChannel: builder.mutation({
      query: (data) => ({
        url: "/api/v1/channel/add-members",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetChannelUserMutation, useAddMembersToChannelMutation } =
  channelApi;
