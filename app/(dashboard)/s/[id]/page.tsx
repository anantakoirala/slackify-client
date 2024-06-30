"use client";
import { WorkspaceContext } from "@/ContextProvider/WorkSpaceProvider";
import { RootState } from "@/redux/store";
import { useFindWorkSpaceQuery } from "@/redux/workspace/workspaceApi";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const Page = (props: Props) => {
  const { id } = useParams();

  const [test, setTest] = useState(false);

  useEffect(() => {
    localStorage.setItem("tid", "");
    localStorage.setItem("type", "");
  });

  return (
    <div>
      <h1>Workspace Chat</h1>
      {/* {workspace ? (
        <div>
          <h2>{workspace.name}</h2>
          <p>ID: {workspace._id}</p>
          <h3>Coworkers:</h3>
          <ul>
            {workspace.coWorkers.map((coworker, index) => (
              <li key={index}>{coworker.username}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={(e: any) => {
              e.preventDefault();
              setTest((prev) => !prev);
            }}
          >
            click
          </button>
        </div>
      ) : (
        <p>No workspace selected.</p>
      )} */}
    </div>
  );
};

export default Page;
