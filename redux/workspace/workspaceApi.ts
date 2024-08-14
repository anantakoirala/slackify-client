import { api } from "../api/api";
import { setMyWorkspaces, setWorkspace } from "./workspaceSlice";

export const workspaceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    findWorkSpace: builder.query({
      query: (id) => {
        return {
          url: `/api/v1/workspace/check-my-workspace/${id}`,
          method: "GET",
          credentials: "include" as const,
        };
      },

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //console.log("result", result);
          dispatch(setWorkspace(result));
        } catch (error) {}
      },
      providesTags: ["workspace"],
    }),
    findAllMyWorkspaces: builder.query<any, void>({
      query: () => ({
        url: `/api/v1/workspace/my-workspaces`,
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          //console.log("myWorkspaces", result.data.myWorkspaces);
          //console.log("result", result);
          dispatch(setMyWorkspaces(result.data.myWorkspaces));
        } catch (error) {}
      },
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
  useFindAllMyWorkspacesQuery,
} = workspaceApi;
