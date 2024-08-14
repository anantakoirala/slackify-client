"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "../../../globals.css";
import SideBar from "@/components/SideBar";
import WorkSpaceProvider from "@/ContextProvider/WorkSpaceProvider";
import Header from "@/components/dashboard/Header";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useFindWorkSpaceQuery } from "@/redux/workspace/workspaceApi";
import { useSound } from "use-sound";

import SocketProvider, {
  SocketContext,
} from "@/ContextProvider/SocketProvider";
import {
  setCallAcceptRejectBox,
  setHuddleOn,
  setHuddleShow,
  setHuddleSwitchChecked,
  setHuddleUserId,
  setHuddleUserName,
  setOnCall,
  setSenderUserId,
} from "@/redux/misc/miscSlice";
import { Headphones, LucideMaximize } from "lucide-react";
import HuddleDialog from "@/components/dailogs/HuddleDialog";
import pattern from "../../../../public/backgroundd.png";
import Image from "next/image";
import { AuthContext } from "@/ContextProvider/AuthProvider";
import {
  BiMicrophone,
  BiMicrophoneOff,
  BiVideo,
  BiVideoOff,
} from "react-icons/bi";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import Huddle from "@/components/Huddle";
import { useMediaQuery } from "@/hooks/use-media-query";
import CallAcceptRejectDialog from "@/components/dailogs/CallAcceptRejectDialog";
import { PeerContext } from "@/ContextProvider/PeerProvider";
import { MediaConnection } from "peerjs";

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

interface ConnectedUsers {
  [userId: string]: boolean;
}

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const videoref = useRef<HTMLVideoElement>(null);
  const videoref2 = useRef<HTMLVideoElement>(null); // Assuming you have a second video reference
  const fullScreenDiv = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const route = useRouter();
  const dispatch = useDispatch();

  const { id, typeid } = useParams();
  const [userIdLeavingRoom, setUserIdLeavingRoom] = useState("");

  const [huddleDialogOpen, setHuddleDialogOpen] = useState(false);

  const [call, setCall] = useState<MediaConnection | null>(null);

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [playRingtone] = useSound("/sounds/ringtone.mp3");

  const pcRefs = React.useRef<Record<string, RTCPeerConnection>>({});
  const [connectedUsers, setConnectedUsers] = React.useState<ConnectedUsers>(
    {}
  );

  const [connectedUser, setConnectedUser] = useState<string[]>([]);

  const socket = useContext(SocketContext);
  const { peerInstance: peer, restartPeerConnection } = useContext(PeerContext);

  const authenticatedUser = useContext(AuthContext);

  const isLargeScreen = useMediaQuery("(min-width:640px)");

  const changeHuddleDialogState = () => {
    console.log("close bhayo");
    setHuddleDialogOpen((prev) => !prev);
    // in small screen if the modal is closed the video chat ends
    if (isLargeScreen === false) {
      dispatch(setHuddleOn(false));
      dispatch(setHuddleUserId(""));
      dispatch(setHuddleShow(false));
      dispatch(setHuddleUserName(""));
      dispatch(setHuddleSwitchChecked(false));
    }
  };

  const { data, isLoading, isError, error } = useFindWorkSpaceQuery(id);

  const { name, _id } = useSelector((state: RootState) => state.workspace);
  const { huddleShow, huddleOn, type, huddleUserName, showSideBar, onCall } =
    useSelector((state: RootState) => state.misc);
  const {
    name: chatName,
    chatId,
    members,
  } = useSelector((state: RootState) => state.chat);

  const enterFullscreen = () => {
    const elem = fullScreenDiv?.current;
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        setFullScreenMode(true);
      }
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreenMode(false);
      console.log("full screen exit");
    }
  };

  const handleHuddleDialogOpen = () => {
    // if (!document.fullscreenElement) {
    //   enterFullscreen();
    // } else {
    //   console.log("hello change bhayo");
    //   exitFullscreen();
    // }
    setHuddleDialogOpen((prev) => !prev);
  };

  const startScreenSharing = async () => {
    try {
      setScreenSharing(true);
    } catch (error) {
      console.log("Error starting screen sharing:", error);
    }
  };

  const stopScreenSharing = async () => {
    try {
      setScreenSharing(false);
    } catch (error) {
      console.log("Error starting screen sharing:", error);
    }
  };

  const toggleVideo = () => {
    const tracks = videoStream?.getVideoTracks();
    if (tracks && tracks.length > 0) {
      tracks[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  // Function to toggle user media audio
  const toggleAudio = async () => {
    const tracks = videoStream?.getAudioTracks();
    if (tracks) {
      if (tracks?.length > 0) {
        tracks[0].enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const setUpPeerConnection = useCallback(async (user: string) => {
    try {
      if (pcRefs.current[user]) {
        console.log(`Peer connection for user ${user} already exists.`);
        return;
      }

      const localstream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setVideoStream(localstream);

      if (videoref.current) {
        videoref.current.srcObject = localstream; // Display local video in videoref
      }
    } catch (error) {
      console.error("Error setting up peer connection:", error);
    }
  }, []);

  // Function to send an SDP offer to another user

  const setUpWebRTC = useCallback(async () => {
    try {
      console.log("call started");
      const userId = authenticatedUser?._id;

      await setUpPeerConnection(userId as string);

      // Emit the "join-room" event when the user starts the call
      socket?.emit("join-room", {
        roomId: chatId,
        userId,
        peerId: peer?.id,
      });

      // Listen for the "room-leave" event to remove the particular video
      socket?.on("room-leave", async (data) => {
        console.log("roomleave", data);

        setUserIdLeavingRoom(data.leftUserId);

        // Clear video element sources

        // if (videoref2.current) {
        //   videoref2.current.srcObject = null;
        // }
      });
    } catch (error) {
      console.log(error);
    }
  }, [authenticatedUser, chatId, setUpPeerConnection, socket, peer]);

  useEffect(() => {
    if (videoStream) {
      peer?.on("call", (call) => {
        call.answer(videoStream);
        call.on("stream", (remoteVideoStream) => {
          if (videoref2.current) {
            videoref2.current.srcObject = remoteVideoStream; // Display local video in videoref
          }
        });
      });
    }

    socket?.on("join-room", ({ roomId, newUserId, peerId }) => {
      console.log(`User ${newUserId} joined room ${roomId}`);

      setConnectedUser((prevUsers) => {
        if (!prevUsers.includes(newUserId)) {
          console.log("Adding User:", newUserId);
          return [...prevUsers, newUserId];
        } else {
          console.log("User already connected:", newUserId);
          return prevUsers;
        }
      });
      //dispatch(setOnCall(true));

      //make call to another user

      if (videoStream) {
        console.log("second");
        const call = peer?.call(peerId, videoStream);
        if (call) {
          call.on("stream", (remoteVideoStream) => {
            console.log("videref2 answer", videoref);
            if (videoref2.current) {
              videoref2.current.srcObject = remoteVideoStream; // Display local video in videoref
            }
            setRemoteStream(remoteVideoStream);
          });
          setCall(call);
        }
      }
    });
  }, [videoStream, socket, peer, dispatch]);

  useEffect(() => {
    console.log("Component re-rendered. Connected Users:", connectedUser);
  }, [connectedUser]);

  useEffect(() => {
    async function stopStream() {
      const userId = authenticatedUser?._id;
      if (videoStream) {
        videoStream?.getTracks().forEach((track) => track.stop());

        // Clear video element sources
        if (videoref.current) {
          videoref.current.srcObject = null;
        }
        if (videoref2.current) {
          videoref2.current.srcObject = null;
        }

        console.log("pcrefs", pcRefs);
        if (userId) {
          console.log("userId", userId);

          console.log("userIdLeavingRoom", userId);
          if (pcRefs.current[userId]) {
            pcRefs.current[userId].close();
          }
          //logActivePeerConnections();

          //console.log("pcrefs", pcRefs.current[userId]);
        }
      }
    }
    if (huddleOn) {
      // console.log("connectd users", Object.keys(connectedUsers));
      // const userId = authenticatedUser?._id;
      // setUpWebRTC();
      console.log("length", connectedUser);
      if (connectedUser.length === 0) {
        setUpWebRTC();
      }
    } else {
      // if (currentCallRef.current) {
      //   currentCallRef.current.close();
      //   currentCallRef.current = null;
      // }

      setConnectedUser((prevUsers) => prevUsers.filter((u) => u !== typeid));

      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }

      socket?.emit("room-leave", {
        roomId: chatId,
        userId: authenticatedUser?._id,
      });

      restartPeerConnection();

      if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
        setRemoteStream(null);

        call?.close();
      }
    }

    return () => {
      // Clean up resources (close the peer connections, stop media streams, etc.)
      // for (const user in pcRefs.current) {
      //   if (pcRefs.current[user]) {
      //     // eslint-disable-next-line react-hooks/exhaustive-deps
      //     pcRefs.current[user].close();
      //   }
      // }
      socket?.off("join-room");

      socket?.off("room-leave");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huddleOn]);

  //for call tone
  useEffect(() => {
    if (!socket) {
      console.log("Socket is not initialized");
      return;
    }

    const handleIncomingCall = (data: any) => {
      const userId = authenticatedUser?._id;

      if (userId !== data.message.sender._id && !onCall) {
        dispatch(setCallAcceptRejectBox(true));
        dispatch(setOnCall(true));
      }
    };

    if (huddleOn && Object.keys(connectedUsers).length !== 1 && !onCall) {
      socket.emit("incomming-call", {
        chatId,
        members: members.map((member) => member._id),
        targetId: typeid,
        organizationId: _id,
      });
    }

    socket.on("incomming-call", handleIncomingCall);

    // Cleanup
    return () => {
      socket.off("incomming-call", handleIncomingCall);
    };
  }, [
    socket,
    chatId,
    typeid,
    dispatch,
    members,
    connectedUsers,
    huddleOn,
    authenticatedUser,
    onCall,
    _id,
  ]);

  useEffect(() => {
    if (isLargeScreen) {
      setIsOpen(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    if (isError) {
      route.push("/");
    }
  }, [error, isError, route]);

  useEffect(() => {
    if (type === "user") {
      dispatch(setHuddleShow(true));
    } else {
      dispatch(setHuddleShow(false));
    }
  }, [type, dispatch]);

  useEffect(() => {
    console.log("remoteStream", remoteStream);
    if (videoStream && videoref.current) {
      videoref.current.srcObject = videoStream;
    }

    if (remoteStream && videoref2.current) {
      console.log("hello");
      videoref2.current.srcObject = remoteStream;
    }
  }, [videoStream, huddleDialogOpen, huddleOn, remoteStream]);

  //event when removing full screen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        console.log("Fullscreen mode activated");
      } else {
        setFullScreenMode(false);
        console.log("Fullscreen mode deactivated");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="bg-background">
      {huddleDialogOpen && (
        <HuddleDialog
          huddleDialogOpen={huddleDialogOpen}
          setHuddleDialogOpen={setHuddleDialogOpen}
          changeHuddleDialogState={changeHuddleDialogState}
          videoref={videoref}
          videoref2={videoref2}
          videoStream={videoStream}
          remoteStream={remoteStream}
          toggleVideo={toggleVideo}
          videoEnabled={videoEnabled}
          screenSharing={screenSharing}
          stopScreenSharing={stopScreenSharing}
          startScreenSharing={startScreenSharing}
          audioEnabled={audioEnabled}
          toggleAudio={toggleAudio}
        />
      )}
      <CallAcceptRejectDialog />

      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-full w-[80%]">
          <SideBar
            showSideBar={showSideBar}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isLargeScreen={isLargeScreen}
          />
        </DrawerContent>
      </Drawer>
      <div className="flex flex-row">
        <div className="w-64 hidden sm:block relative">
          <div className="h-full">
            <SideBar showSideBar={showSideBar} />
          </div>
          {/* webcam section */}
          {huddleOn && !huddleDialogOpen && (
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
                        className="w-full h-full object-cover rounded-md second"
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
                    onClick={
                      screenSharing ? stopScreenSharing : startScreenSharing
                    }
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
          )}
          {/* webcam section ends */}
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="w-full h-16 bg-white">
            <Header
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLargeScreen={isLargeScreen}
              handleHuddleDialogOpen={handleHuddleDialogOpen}
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
