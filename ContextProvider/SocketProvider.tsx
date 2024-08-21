"use client";
import { RootState } from "@/redux/store";
import React, { createContext, useMemo } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | undefined>(undefined);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { _id } = useSelector((state: RootState) => state.workspace);

  const organizationId = _id;
  const socket: Socket = useMemo(() => {
    return io(`${process.env.NEXT_PUBLIC_SOCKETURL}`, {
      withCredentials: true,
      query: { organizationId },
      reconnection: false,
    });
  }, [organizationId]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
