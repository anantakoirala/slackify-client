"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setCallAcceptRejectBox,
  setHuddleOn,
  setHuddleSwitchChecked,
  setOnCall,
} from "@/redux/misc/miscSlice";
import { Button } from "../ui/button";
import { useSound } from "use-sound";
import { Howl } from "howler";
import SocketProvider, {
  SocketContext,
} from "@/ContextProvider/SocketProvider";
import { AuthContext } from "@/ContextProvider/AuthProvider";

type Props = {};

const CallAcceptRejectDialog = (props: Props) => {
  const [playRingtone] = useSound("/sounds/ringtone.mp3");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [stateChage, setStateChange] = useState(false);
  const dispatch = useDispatch();
  const { callAcceptRejectBox } = useSelector((state: RootState) => state.misc);
  const socket = useContext(SocketContext);
  const authenticatedUser = useContext(AuthContext);
  const { chatId } = useSelector((state: RootState) => state.chat);

  const handleCallAccetpRejectDialog = () => {
    dispatch(setCallAcceptRejectBox(false));
  };

  const handleOnAccept = () => {
    const userId = authenticatedUser?._id;
    // socket?.emit("join-room", {
    //   roomId: chatId,
    //   userId,
    // });
    dispatch(setCallAcceptRejectBox(false));
    dispatch(setHuddleOn(true));
    dispatch(setHuddleSwitchChecked(true));
  };

  const handleOnReject = () => {
    dispatch(setCallAcceptRejectBox(false));
  };

  useEffect(() => {
    let sound: any;
    if (callAcceptRejectBox) {
      sound = new Howl({
        src: ["/sounds/ringtone.mp3"], // Replace with your sound file path
        autoplay: true,
        volume: 0.5,
        loop: true,
        onplayerror: function () {
          console.error("Failed to play notification sound");
        },
      });
    }

    return () => {
      if (sound) {
        sound.stop(); // Clean up sound instance if needed
      }
    };
  }, [callAcceptRejectBox]);

  const handleResume = () => {
    localStorage.setItem("gesture", "gesture");
    console.log("Simulated user gesture");
  };
  return (
    <AlertDialog
      open={callAcceptRejectBox}
      onOpenChange={handleCallAccetpRejectDialog}
    >
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <Button onClick={handleOnAccept}>Accept</Button>
          <Button
            ref={buttonRef}
            className="bg-red-600"
            onClick={handleOnReject}
          >
            Decline
          </Button>

          {/* <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CallAcceptRejectDialog;
