"use client";
import Image from "next/image";
import { IoLogoSlack } from "react-icons/io";
import logo from "../public/logo.svg";
import WorkspacesSvg from "@/components/WorkSpace";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { restApi } from "@/api";
import { checkAuthentication } from "@/lib/utils";

type WorkSpaceResponse = {
  _id: string;
  name: string;
  coWorkers: string[];
};

export default function Home() {
  const [workspaces, setWorkspaces] = useState<WorkSpaceResponse[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuthenticationAndLog = async () => {
      const response = await checkAuthentication();
      setIsAuthenticated(response);
      console.log("Is authenticated:", isAuthenticated);
    };

    checkAuthenticationAndLog();
    if (isAuthenticated) {
      console.log("hello");
      restApi
        .get("/api/v1/workspace/my-workspaces")
        .then((res) => {
          console.log("response", res);
          console.log("res", res.data.myWorkspaces);
          setWorkspaces(res.data.myWorkspaces);
        })
        .catch((error) => console.log(error));
    }
  }, [setIsAuthenticated, isAuthenticated]);
  return (
    <>
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex flex-col items-center justify-center  bg-background  w-full min-h-screen pt-10">
        {/* <Image src={logo} alt="logo" width={100} height={100} /> */}
        <div className="flex flex-col sm:flex-row mt-24 justify-evenly px-2 sm:px-72 mb-24">
          <div className="flex flex-col items-center sm:items-start justify-center">
            <span className="text-4xl font-extrabold text-white text-center ">
              Get started on Slackify
            </span>
            <span className="text-sm mt-7 w-[70%] text-white text-center sm:text-start">
              its a new way to communicate with everyone you work with. its
              faster, better organized, and more secure than email - and its
              free to try.
            </span>

            <Link
              href={"/create-organization"}
              className="w-60 bg-primary hover:bg-primary/75 mt-6 text-center h-10  px-4 py-2 justify-center inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Create Workspace
            </Link>
          </div>
          <div className="hidden sm:block">
            <WorkspacesSvg />
          </div>
        </div>

        {workspaces.length > 0 &&
          workspaces.map((workspace, index) => (
            <div
              className="flex w-[70%] sm:w-[50%] h-28 border border-1  rounded-md mb-4 bg-card items-center justify-center"
              key={index}
            >
              <div className="flex w-full flex-col sm:flex-row items-center justify-between p-4 gap-1">
                <div className="flex flex-col items-center sm:items-start justify-center">
                  <span className="text-white text-2xl font-bold">
                    {workspace.name}
                  </span>
                  <span className="text-sm text-white">
                    {workspace.coWorkers.length} members
                  </span>
                </div>

                <Link
                  href={`/s/${workspace._id}`}
                  className="w-36 bg-primary hover:bg-primary/75  text-center h-10  px-4 py-2 justify-center inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  "
                >
                  open
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
