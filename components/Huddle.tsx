"use client";
import { LucideMaximize } from "lucide-react";
import pattern from "../public/backgroundd.png";
import React, { useEffect } from "react";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiVideo,
  BiVideoOff,
} from "react-icons/bi";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";

type Props = {
  huddleOn: boolean;
  huddleUserName: string;
  handleHuddleDialogOpen: () => void;
  videoref: React.RefObject<HTMLVideoElement>;
  videoref2: React.RefObject<HTMLVideoElement>;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  startScreenSharing: () => void;
  stopScreenSharing: () => void;
};

const Huddle = ({
  huddleOn,
  huddleUserName,
  handleHuddleDialogOpen,
  videoref,
  videoref2,
  videoEnabled,
  audioEnabled,
  screenSharing,
  toggleVideo,
  toggleAudio,
  startScreenSharing,
  stopScreenSharing,
}: Props) => {
  useEffect(() => {
    if (huddleOn) {
      if (videoref.current && videoref.current.srcObject) {
        videoref.current.srcObject = videoref.current.srcObject;
      }
      if (videoref2.current && videoref2.current.srcObject) {
        videoref2.current.srcObject = videoref2.current.srcObject;
      }
    }
  }, [huddleOn, videoref, videoref2]);
  return (
    <>
      <div
        className={`w-full  bg-card ${
          huddleOn ? "h-40 items-start" : "hidden items-center"
        } border border-primary rounded-tl-md rounded-tr-md absolute bottom-0 flex flex-col px-2 `}
      >
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="text-primary text-sm">{huddleUserName}</div>
          <LucideMaximize
            onClick={handleHuddleDialogOpen}
            className="text-primary text-sm w-3"
          />
        </div>
        <div
          className="w-full h-full  mb-1 rounded-sm"
          style={{
            backgroundImage: `url(${pattern.src})`,
            objectFit: "cover",
          }}
        >
          {/* video here */}
          <div className="flex flex-row w-full h-[75%] gap-1 pt-1 px-2 ">
            <div className="flex-1 h-full bg-red-500 rounded-md">
              <video
                autoPlay
                ref={videoref}
                playsInline
                className={`w-full h-full object-cover rounded-md ${
                  !videoEnabled ? "hidden" : ""
                }`}
              ></video>
              {!videoEnabled && (
                <div className="w-full h-full bg-red-500 rounded-md"></div>
              )}
            </div>
            <div className="flex-1 h-full bg-lime-600 rounded-md">
              {videoEnabled ? (
                <video
                  autoPlay
                  ref={videoref2}
                  playsInline
                  className="w-full h-full object-cover rounded-md"
                ></video>
              ) : (
                <div className="w-full h-full bg-lime-600 rounded-md"></div>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full h-[21%]  mb-1 mt-1 px-2 items-center justify-center">
            <div
              onClick={toggleVideo}
              className="bg-primary rounded-md w-[1.9rem] h-[1.9rem] flex items-center justify-center m-1"
            >
              {!videoEnabled ? (
                <BiVideoOff size="1.7rem" className="text-red-500" />
              ) : (
                <BiVideo size="1.8rem" />
              )}
            </div>
            <div
              onClick={toggleAudio}
              className="bg-primary rounded-md w-[1.9rem] h-[1.9rem] flex items-center justify-center m-1"
            >
              {!audioEnabled ? (
                <BiMicrophoneOff size="4rem" />
              ) : (
                <BiMicrophone size="4rem" />
              )}
            </div>
            <div
              onClick={screenSharing ? stopScreenSharing : startScreenSharing}
              className="bg-primary rounded-md w-[1.9rem] h-[1.9rem] flex items-center justify-center m-1"
            >
              {screenSharing ? (
                <LuScreenShareOff size="1.6rem" />
              ) : (
                <LuScreenShare size="1.6rem" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Huddle;
