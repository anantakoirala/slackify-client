"use client";
import React, { useRef } from "react";

type Props = {};

const Page = (props: Props) => {
  const videoref = useRef<HTMLVideoElement>(null);
  const startCall = (e: any) => {
    e.preventDefault();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoref.current) {
          videoref.current.srcObject = stream;
        }
      });
  };
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <video autoPlay ref={videoref} src=""></video>
      <button
        type="button"
        className="w-12 h-12 bg-green-300 rounded-md border
    "
        onClick={startCall}
      >
        Start
      </button>
    </div>
  );
};

export default Page;
