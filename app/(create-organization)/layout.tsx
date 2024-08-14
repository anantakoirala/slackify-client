"use client";
import React, { useState } from "react";
import "../globals.css";
import SideBar from "@/components/SideBar";
import OrganizationSidebar from "@/components/OrganizationSidebar";
import AuthProvider from "@/ContextProvider/AuthProvider";

export default function OrganizationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <div className="flex flex-row">
      {/* sidebar */}
      <AuthProvider>
        <OrganizationSidebar />

        <div className="flex-grow bg-primary min-h-screen">
          {/* header */}

          <main className="p-8  min-h-screen  bg-card/80">{children}</main>
          {/* main */}
        </div>
      </AuthProvider>
      {/* main body */}
    </div>
  );
}
