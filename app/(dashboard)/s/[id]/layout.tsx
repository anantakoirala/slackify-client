"use client";
import React, { useEffect, useState } from "react";
import "../../../globals.css";
import SideBar from "@/components/SideBar";
import WorkSpaceProvider from "@/ContextProvider/WorkSpaceProvider";
import Header from "@/components/dashboard/Header";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useFindWorkSpaceQuery } from "@/redux/workspace/workspaceApi";
import SocketProvider from "@/ContextProvider/SocketProvider";
import { setHuddleOn, setHuddleShow } from "@/redux/misc/miscSlice";
import { Headphones, LucideMaximize } from "lucide-react";
import HuddleDialog from "@/components/dailogs/HuddleDialog";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [showSideBar, setShowSideBar] = useState(false);
  const [huddleDialogOpen, setHuddleDialogOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { data, isLoading, isError, error } = useFindWorkSpaceQuery(id);
  const { name } = useSelector((state: RootState) => state.workspace);
  const { huddleShow, huddleOn, type, huddleUserName } = useSelector(
    (state: RootState) => state.misc
  );
  const { name: chatName } = useSelector((state: RootState) => state.chat);

  const handleToggleChange = (e: any) => {
    setIsChecked(e.target.checked);
    dispatch(setHuddleOn(e.target.checked));
  };

  const handleHuddleDialogOpen = () => {
    setHuddleDialogOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isError) {
      route.push("/");
    }
  }, [error, isError, route]);

  useEffect(() => {
    console.log("type111", type);
    if (type === "user") {
      dispatch(setHuddleShow(true));
    } else {
      dispatch(setHuddleShow(false));
    }
  }, [type, dispatch]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="bg-background">
      <HuddleDialog
        huddleDialogOpen={huddleDialogOpen}
        setHuddleDialogOpen={setHuddleDialogOpen}
      />
      <div className="flex flex-row">
        <div className="w-64 hidden sm:block relative">
          <div className="h-full">
            <SideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
            />
          </div>

          {huddleOn && (
            <div
              className={`w-full  bg-primary ${
                huddleOn ? "h-40 items-start" : "hidden items-center"
              } border rounded-tl-md rounded-tr-md absolute bottom-0 flex  justify-between px-2`}
            >
              <div className="flex flex-row justify-between items-center w-full p-1">
                <div>{huddleUserName}</div>
                <LucideMaximize onClick={handleHuddleDialogOpen} />
              </div>
              {/* <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleToggleChange}
                  checked={isChecked}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-red-700 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-red-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600  "></div>
                <Headphones />
              </label> */}
              {/* <label className="flex cursor-pointer select-none items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleToggleChange}
                    className="sr-only"
                  />
                  <div
                    className={`block h-8 w-14 rounded-full transition ${
                      isChecked ? "bg-red-800" : " bg-background"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                      isChecked ? "transform translate-x-full" : ""
                    }`}
                  >
                    {isChecked ? (
                      <span className="active text-center">
                        <Headphones />
                      </span>
                    ) : (
                      <span className="inactive ">
                        <Headphones />
                      </span>
                    )}
                  </div>
                </div>
              </label> */}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="w-full h-16 bg-white">
            <Header />
          </div>
          <SocketProvider>{children}</SocketProvider>
        </div>
      </div>
    </div>
  );
}
