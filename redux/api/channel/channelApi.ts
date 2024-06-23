import { createApi } from "@reduxjs/toolkit/query";
import { api } from "../api";

const channelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createChannel: builder.mutation({
      query: (data) => ({
        url: `http://localhost:7000/api/v1/channel/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["workspace"],
    }),
  }),
});

export const { useCreateChannelMutation } = channelApi;
