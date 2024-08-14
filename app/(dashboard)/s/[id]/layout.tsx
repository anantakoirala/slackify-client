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

import Header from "@/components/dashboard/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import {
  useFindAllMyWorkspacesQuery,
  useLazyFindWorkSpaceQuery,
} from "@/redux/workspace/workspaceApi";
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
} from "@/redux/misc/miscSlice";

import HuddleDialog from "@/components/dailogs/HuddleDialog";

import { AuthContext } from "@/ContextProvider/AuthProvider";

import { Drawer, DrawerContent } from "@/components/ui/drawer";

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

  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isReceiver, setIsReceiver] = useState<boolean>(false);

  const [playRingtone] = useSound("/sounds/ringtone.mp3");

  const pcRefs = React.useRef<Record<string, RTCPeerConnection>>({});
  const [connectedUsers, setConnectedUsers] = React.useState([]);

  const [connectedUser, setConnectedUser] = useState<string[]>([]);

  const socket = useContext(SocketContext);
  const { peerInstance: peer, restartPeerConnection } = useContext(PeerContext);

  const authenticatedUser = useContext(AuthContext);

  const isLargeScreen = useMediaQuery("(min-width:640px)");

  const changeHuddleDialogState = () => {
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

  // const { data, isLoading, isError, error, refetch } =
  //   useFindWorkSpaceQuery(id);
  const [trigger, { data, isLoading, isError, error }] =
    useLazyFindWorkSpaceQuery();
  const { data: myWorkspaces, isLoading: myWorkspaceLoading } =
    useFindAllMyWorkspacesQuery();
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

  // Function to send an SDP offer to another user

  // const setUpWebRTC = useCallback(async () => {
  //   try {
  //     console.log("call started");
  //     const userId = authenticatedUser?._id;

  //     try {
  //       const localstream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //         video: true,
  //       });

  //       setVideoStream(localstream);
  //       dispatch(setOnCall(true));

  //       if (videoref.current) {
  //         videoref.current.srcObject = localstream; // Display local video in videoref
  //       }
  //     } catch (error) {
  //       console.error("Error setting up peer connection:", error);
  //     }

  //     if (!isReceiver) {
  //       if (typeid) {
  //         localStorage.setItem("cid", chatId);
  //       }
  //     }

  //     const newchatId = localStorage.getItem("cid");

  //     // Emit the "join-room" event when the user starts the call
  //     socket?.emit("join-room", {
  //       roomId: localStorage.getItem("cid"),
  //       userId,
  //       peerId: peer?.id,
  //     });

  //     if (!onCall) {
  //       console.log("emit incomming call");
  //       socket?.emit("incomming-call", {
  //         chatId: newchatId,
  //       });
  //     }

  //     // Listen for the "room-leave" event to remove the particular video
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [
  //   authenticatedUser,
  //   chatId,
  //   dispatch,
  //   socket,
  //   peer,
  //   typeid,
  //   isReceiver,
  //   onCall,
  // ]);

  useEffect(() => {
    if (videoStream) {
      peer?.on("call", (call) => {
        call.answer(videoStream);
        call.on("stream", (remoteVideoStream) => {
          setRemoteStream(remoteVideoStream);
        });
      });
    }

    socket?.on("join-room", ({ roomId, newUserId, peerId }) => {
      console.log(`User ${newUserId} joined room ${roomId}`);

      //make call to another user

      if (videoStream) {
        const call = peer?.call(peerId, videoStream);
        if (call) {
          call.on("stream", (remoteVideoStream) => {
            console.log("videref2 answer", videoref);
            setRemoteStream(remoteVideoStream);
          });
        }
      }
    });
  }, [videoStream, socket, peer, dispatch]);

  useEffect(() => {
    const initiateCall = async () => {
      if (huddleOn) {
        if (!onCall) {
          try {
            console.log("call started");
            const userId = authenticatedUser?._id;

            try {
              const localstream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
              });

              setVideoStream(localstream);
              dispatch(setOnCall(true));

              if (videoref.current) {
                videoref.current.srcObject = localstream; // Display local video in videoref
              }
            } catch (error) {
              console.error("Error setting up peer connection:", error);
            }

            if (!isReceiver) {
              if (typeid) {
                localStorage.setItem("cid", chatId);
              }
            }

            const newchatId = localStorage.getItem("cid");

            // Emit the "join-room" event when the user starts the call
            socket?.emit("join-room", {
              roomId: localStorage.getItem("cid"),
              userId,
              peerId: peer?.id,
            });

            if (!onCall) {
              console.log("emit incomming call");
              socket?.emit("incomming-call", {
                chatId: newchatId,
              });
            }

            const handleIncomingCall = (data: any) => {
              const userId = authenticatedUser?._id;

              if (userId !== data.message.sender._id && !onCall) {
                dispatch(setCallAcceptRejectBox(true));

                localStorage.setItem("cid", data.message.chat);
                dispatch(setHuddleUserId(data.message.sender._id));
                setIsReceiver(true);
              }
            };
            if (!onCall) {
              socket?.on("incomming-call", handleIncomingCall);
            }

            // Listen for the "room-leave" event to remove the particular video
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        setConnectedUser([]);
        setIsReceiver(false);
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
          setVideoStream(null);
        }

        // socket?.emit("room-leave", {
        //   roomId: chatId,
        //   userId: authenticatedUser?._id,
        // });
        if (onCall) {
          socket?.emit("end-call", {
            roomId: localStorage.getItem("cid"),
          });
        }
        dispatch(setOnCall(false));
        restartPeerConnection();

        if (remoteStream) {
          remoteStream.getTracks().forEach((track) => track.stop());
          setRemoteStream(null);
        }
      }
    };

    initiateCall();

    return () => {
      socket?.off("join-room");
      socket?.off("incomming-call");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huddleOn, onCall]);

  //for call tone
  // useEffect(() => {
  //   console.log("hello");
  //   if (!socket) {
  //     console.log("Socket is not initialized");
  //     return;
  //   }

  //   const handleIncomingCall = (data: any) => {
  //     const userId = authenticatedUser?._id;

  //     if (userId !== data.message.sender._id && !onCall) {
  //       dispatch(setCallAcceptRejectBox(true));

  //       localStorage.setItem("cid", data.message.chat);
  //       dispatch(setHuddleUserId(data.message.sender._id));
  //       setIsReceiver(true);
  //     }
  //   };
  //   if (!onCall) {
  //     socket.on("incomming-call", handleIncomingCall);
  //   }

  //   // Cleanup
  //   return () => {
  //     socket.off("incomming-call", handleIncomingCall);
  //   };
  // }, [
  //   socket,
  //   chatId,
  //   typeid,
  //   dispatch,
  //   members,
  //   connectedUsers,
  //   huddleOn,
  //   authenticatedUser,
  //   onCall,
  //   _id,
  // ]);

  useEffect(() => {
    socket?.on("end-call", () => {
      dispatch(setCallAcceptRejectBox(false));

      localStorage.removeItem("cid");

      setRemoteStream(null);
    });

    socket?.on("connection-lost", () => {
      dispatch(setCallAcceptRejectBox(false));
    });

    return () => {
      socket?.off("end-call");
    };
  }, [socket, dispatch]);

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

  useEffect(() => {
    trigger(id);
  }, [id, trigger]);

  if (isLoading && myWorkspaceLoading) {
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
            <Huddle
              huddleOn={huddleOn}
              huddleUserName={huddleUserName}
              handleHuddleDialogOpen={handleHuddleDialogOpen}
              videoref={videoref}
              videoref2={videoref2}
              videoEnabled={videoEnabled}
              audioEnabled={audioEnabled}
              screenSharing={screenSharing}
              toggleVideo={toggleVideo}
              toggleAudio={toggleAudio}
              startScreenSharing={startScreenSharing}
              stopScreenSharing={stopScreenSharing}
              remoteStream={remoteStream}
            />
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
