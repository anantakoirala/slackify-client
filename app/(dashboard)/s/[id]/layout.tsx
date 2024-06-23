"use client";
import React, { useState } from "react";
import "../../../globals.css";
import SideBar from "@/components/SideBar";
import WorkSpaceProvider from "@/ContextProvider/WorkSpaceProvider";
import Header from "@/components/dashboard/Header";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useParams } from "next/navigation";
import { useFindWorkSpaceQuery } from "@/redux/workspace/workspaceApi";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSideBar, setShowSideBar] = useState(false);
  const { id } = useParams();
  const { data, isLoading } = useFindWorkSpaceQuery(id);
  const { name } = useSelector((state: RootState) => state.workspace);
  if (isLoading) {
    return <>hello</>;
  }

  console.log("name", name);

  return (
    <div className="flex bg-background">
      {/* sidebar */}
      <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />

      <div className="lg:ml-64 ml-0 flex-grow bg-primary min-h-screen">
        {/* header */}
        <Header />
        <main className="p-8  min-h-screen  bg-card/80">{children}</main>

        {/* main */}
      </div>

      {/* main body */}
    </div>
  );
}
