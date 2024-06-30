import { api } from "../api/api";
import { setWorkspace } from "./workspaceSlice";

export const workspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findWorkSpace: builder.query({
      query: (id) => ({
        url: `/api/v1/workspace/check-my-workspace/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //console.log("result", result);
          dispatch(setWorkspace(result));
        } catch (error) {}
      },
      providesTags: ["workspace"],
    }),
    sendInvitation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/v1/workspace/${id}`,
        method: "PUT",
        body: { data },
      }),
    }),
  }),
});

export const {
  useFindWorkSpaceQuery,
  useLazyFindWorkSpaceQuery,
  useSendInvitationMutation,
} = workspaceApi;
