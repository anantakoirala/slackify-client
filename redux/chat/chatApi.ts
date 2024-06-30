import { api } from "../api/api";
import { setChatId, setChatMembers, setName } from "./chatSlice";

const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    newChat: builder.mutation({
      query: (data) => {
        //console.log("data", data);
        return {
          url: "/api/v1/chat/new",
          method: "POST",
          body: data,
        };
      },

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //console.log("result", result);
          dispatch(setChatId(result));
          dispatch(setChatMembers(result));
          dispatch(setName(result));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
  }),
});

export const { useNewChatMutation } = chatApi;
