import React, { SetStateAction, RefObject, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import pattern from "../../public/large.png";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiVideo,
  BiVideoOff,
} from "react-icons/bi";

import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";

type Props = {
  huddleDialogOpen: boolean;
  setHuddleDialogOpen: React.Dispatch<SetStateAction<boolean>>;
  changeHuddleDialogState: () => void;
  videoref: RefObject<HTMLVideoElement>;
  videoref2: RefObject<HTMLVideoElement>;
  videoStream: MediaStream | null;
  remoteStream: MediaStream | null;
  toggleVideo: () => void;
  videoEnabled: boolean;
  screenSharing: boolean;
  audioEnabled: boolean;
  stopScreenSharing: () => void;
  startScreenSharing: () => void;
  toggleAudio: () => void;
};

const HuddleDialog = ({
  huddleDialogOpen,
  setHuddleDialogOpen,
  changeHuddleDialogState,
  videoref,
  videoref2,
  videoStream,
  toggleVideo,
  videoEnabled,
  screenSharing,
  stopScreenSharing,
  startScreenSharing,
  audioEnabled,
  toggleAudio,
  remoteStream,
}: Props) => {
  useEffect(() => {
    console.log("videoref111", videoref);
    if (videoStream) {
      if (videoref.current) {
        videoref.current.srcObject = videoStream;
      }
      if (videoref2.current) {
        videoref2.current.srcObject = remoteStream;
      }
    }
  }, [videoStream, huddleDialogOpen, videoref, videoref2, remoteStream]);

  return (
    <Dialog
      open={huddleDialogOpen}
      onOpenChange={changeHuddleDialogState}
      modal
    >
      <DialogContent className="w-full max-w-xs sm:max-w-6xl">
        <DialogHeader>
          {/* <DialogTitle className="mb-2 text-primary">
            Are you absolutely sure?
          </DialogTitle> */}
        </DialogHeader>
        <div
          className="w-full h-[75vh] flex flex-col items-center justify-center"
          style={{
            backgroundImage: `url(${pattern.src})`,
            objectFit: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-row w-full h-[75%] gap-1 pt-1 px-2 ">
            <div className="flex-1 h-full bg-red-500 rounded-md">
              <video
                autoPlay
                ref={videoref}
                src=""
                playsInline
                className="w-full h-full object-cover rounded-md"
              ></video>
            </div>

            <div className="flex-1 h-full bg-lime-600 rounded-md">
              <video
                autoPlay
                ref={videoref2}
                src=""
                playsInline
                className="w-full h-full object-cover rounded-md"
              ></video>
            </div>
          </div>
          <div className="flex flex-row w-full h-[21%]  mb-1 mt-1 px-2 items-center justify-center">
            <div
              onClick={toggleVideo}
              className="bg-primary rounded-md  flex items-center justify-center m-1"
            >
              {!videoEnabled ? (
                <BiVideoOff size="4rem" className="text-red-500" />
              ) : (
                <BiVideo size="4rem" />
              )}
            </div>
            <div
              onClick={toggleAudio}
              className="bg-primary rounded-md  flex items-center justify-center m-1"
            >
              {!audioEnabled ? (
                <BiMicrophoneOff size="4rem" />
              ) : (
                <BiMicrophone size="4rem" />
              )}
            </div>
            <div
              onClick={screenSharing ? stopScreenSharing : startScreenSharing}
              className="bg-primary rounded-md  flex items-center justify-center m-1"
            >
              {screenSharing ? (
                <LuScreenShareOff size="4rem" />
              ) : (
                <LuScreenShare size="4rem" />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HuddleDialog;
