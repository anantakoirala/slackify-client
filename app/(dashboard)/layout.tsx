"use client";
import React, { useState } from "react";
import SideBar from "@/components/SideBar";
import WorkSpaceProvider from "@/ContextProvider/WorkSpaceProvider";
import Header from "@/components/dashboard/Header";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import SocketProvider from "@/ContextProvider/SocketProvider";
import AuthProvider from "@/ContextProvider/AuthProvider";
import PeerProvider from "@/ContextProvider/PeerProvider";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <div className="">
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider>
            <PeerProvider>{children}</PeerProvider>
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </div>
  );
}
