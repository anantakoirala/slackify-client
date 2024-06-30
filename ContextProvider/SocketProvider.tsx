"use client";
import React, { createContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | undefined>(undefined);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket: Socket = useMemo(() => {
    return io("http://localhost:7000", { withCredentials: true });
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
