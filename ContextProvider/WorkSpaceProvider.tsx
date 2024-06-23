"use client";
import { restApi } from "@/api";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  children: React.ReactNode;
};

type WorkSpaceContextSchema = {
  name: string;
  _id: string;
  coWorkers: { _id: string; username: string }[];
  channels: { _id: string; name: string }[];
  type: string;
  refreshWorkspace: () => void;
};

const defaultWorkspace: WorkSpaceContextSchema = {
  name: "",
  _id: "",
  coWorkers: [],
  type: "",
  channels: [],
  refreshWorkspace: () => {},
};

export const WorkspaceContext = createContext<
  WorkSpaceContextSchema | undefined
>(defaultWorkspace);

const WorkSpaceProvider = ({ children }: Props) => {
  const [workspace, setWorkspace] =
    useState<WorkSpaceContextSchema>(defaultWorkspace);
  const params = useParams();

  const fetchWorkspace = useCallback(async () => {
    const res = await restApi.get(
      `/api/v1/workspace/check-my-workspace/${params.id}`
    );
    //console.log("res", res);
    setWorkspace(res.data.workspace);
  }, [params.id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const contextValue = useMemo(
    () => ({
      ...workspace,
      refreshWorkspace: fetchWorkspace,
    }),
    [workspace, fetchWorkspace]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkSpaceProvider;
