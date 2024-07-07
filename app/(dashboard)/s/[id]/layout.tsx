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
import SocketProvider, {
  SocketContext,
} from "@/ContextProvider/SocketProvider";
import { setHuddleOn, setHuddleShow } from "@/redux/misc/miscSlice";
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

import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";

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
  const route = useRouter();
  const dispatch = useDispatch();

  const { id, typeid } = useParams();
  const [userIdLeavingRoom, setUserIdLeavingRoom] = useState("");
  const [showSideBar, setShowSideBar] = useState(false);
  const [huddleDialogOpen, setHuddleDialogOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const pcRefs = React.useRef<Record<string, RTCPeerConnection>>({});
  const [connectedUsers, setConnectedUsers] = React.useState<ConnectedUsers>(
    {}
  );

  const socket = useContext(SocketContext);

  const authenticatedUser = useContext(AuthContext);

  const changeHuddleDialogState = () => {
    console.log("hello");
    setHuddleDialogOpen((prev) => !prev);
  };

  const { data, isLoading, isError, error } = useFindWorkSpaceQuery(id);
  const { name } = useSelector((state: RootState) => state.workspace);
  const { huddleShow, huddleOn, type, huddleUserName } = useSelector(
    (state: RootState) => state.misc
  );
  const { name: chatName, chatId } = useSelector(
    (state: RootState) => state.chat
  );

  const handleHuddleDialogOpen = () => {
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
    console.log("video_ref", videoref.current);
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

  const logActivePeerConnections = () => {
    console.log("Active Peer Connections:");
    Object.keys(pcRefs.current).forEach((userId) => {
      console.log(
        `User ID: ${userId}, Peer Connection:`,
        pcRefs.current[userId]
      );
    });
  };

  const setUpPeerConnection = useCallback(
    async (user: string) => {
      try {
        if (pcRefs.current[user]) {
          console.log(`Peer connection for user ${user} already exists.`);
          return;
        }
        if (screenSharing) {
          const localstream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
        } else {
          const localstream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setVideoStream(localstream);

          if (videoref.current) {
            videoref.current.srcObject = localstream; // Display local video in videoref
          }

          const pc = new RTCPeerConnection(config);
          pc.onicecandidate = (event) => {
            console.log("setUpPeerConnection icecandidate", event);
            if (event.candidate) {
              socket?.emit("ice-candidate", {
                roomId: chatId,
                candidate: event.candidate,
                senderUserId: user,
              });
            }
          };

          pc.onconnectionstatechange = (e) => {
            console.log("Connection state:", pc.connectionState);
          };

          pc.ontrack = (event) => {
            const stream = event.streams[0];
            console.log("ontrack", event.streams[0]);
            if (videoref2.current) {
              setRemoteStream(stream);
              videoref2.current.srcObject = stream; // Display remote video in videoref2
            }
          };
          localstream.getTracks().forEach((track) => {
            pc.addTrack(track, localstream as MediaStream);
          });
          if (authenticatedUser) {
            pcRefs.current[user] = pc;
            logActivePeerConnections();
          }
        }
      } catch (error) {}
    },
    [authenticatedUser, chatId, screenSharing, socket]
  );

  // Function to send an SDP offer to another user
  const sendOffer = useCallback(
    (offer: RTCSessionDescriptionInit, targetUserId: string) => {
      console.log("offer was sent", offer, targetUserId);
      socket?.emit("offer", { offer, targetUserId });
    },
    [socket]
  );

  // Function to send an SDP answer to another user

  const sendAnswer = useCallback(
    (answer: RTCSessionDescriptionInit, senderUserId: string) => {
      console.log("answer was sent", answer, senderUserId);
      socket?.emit("answer", { answer, senderUserId });
    },
    [socket]
  );

  // Function to handle an incoming SDP offer

  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit, senderUserId: string) => {
      try {
        await pcRefs.current[senderUserId].setRemoteDescription(offer);
        const answer = await pcRefs.current[senderUserId].createAnswer();
        await pcRefs.current[senderUserId].setLocalDescription(answer);
        sendAnswer(
          pcRefs.current[senderUserId]
            .localDescription as RTCSessionDescriptionInit,
          senderUserId
        );
      } catch (error) {
        console.log("Error handling offer:");
      }
    },
    [sendAnswer]
  );

  async function handleAnswer(
    answer: RTCSessionDescriptionInit,
    senderUserId: string
  ) {
    try {
      const pc = pcRefs.current[senderUserId];
      await pc.setRemoteDescription(answer);
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  }

  // Function to handle an incoming ICE candidate
  async function handleIceCandidate(
    candidate: RTCIceCandidateInit,
    senderUserId: string
  ) {
    candidate = new RTCIceCandidate(candidate);
    pcRefs.current[senderUserId]?.addIceCandidate(candidate).catch((error) => {
      console.log("Error adding ICE candidate:", error);
    });
    console.log("Received ICE candidate:", candidate, senderUserId);
  }

  const setUpWebRTC = useCallback(async () => {
    try {
      const userId = authenticatedUser?._id;

      await setUpPeerConnection(userId as string);

      // Emit the "join-room" event when the user starts the call
      socket?.emit("join-room", {
        roomId: chatId,
        userId,
        targetUserId: typeid,
      });

      // Listen for the "join-room" event to trigger a call when another user joins
      socket?.on("join-room", ({ roomId, otherUserId }) => {
        console.log(`User ${otherUserId} joined room ${roomId}`);
        setConnectedUsers({ [otherUserId]: true });
      });

      // Event listener for receiving SDP offers from other users
      socket?.on("offer", ({ offer, senderUserId }) => {
        console.log("offer", offer);
        handleOffer(offer, senderUserId);
      });

      // Event listener for receiving SDP answers from other users
      socket?.on("answer", ({ answer, senderUserId }) => {
        handleAnswer(answer, senderUserId);
      });

      // Event listener for receiving ICE candidates from other users
      socket?.on("ice-candidate", (candidate, senderUserId) => {
        handleIceCandidate(candidate, senderUserId);
      });

      // Listen for the "room-leave" event to remove the particular video
      socket?.on("room-leave", async (data) => {
        console.log("data", data);
        console.log("leftUserId-data", data.leftUserId);
        setUserIdLeavingRoom(data.leftUserId);
      });
    } catch (error) {
      console.log(error);
    }
  }, [
    authenticatedUser,
    chatId,
    setUpPeerConnection,
    socket,
    handleOffer,
    typeid,
  ]);

  useEffect(() => {
    console.log("pcrefs", pcRefs);
    async function stopStream() {
      const userId = authenticatedUser?._id;
      if (videoStream) {
        socket?.emit("room-leave", {
          roomId: chatId,
          userId: authenticatedUser?._id,
        });
        videoStream?.getTracks().forEach((track) => track.stop());
        console.log("vidoestream stream", videoStream);
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
          logActivePeerConnections();
          console.log("pcrefs", pcRefs.current[userId]);
        }
      }
    }
    if (huddleOn) {
      setUpWebRTC();
    } else {
      stopStream();
    }

    return () => {
      console.log("clear");
      // Clean up resources (close the peer connections, stop media streams, etc.)
      for (const user in pcRefs.current) {
        if (pcRefs.current[user]) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          pcRefs.current[user].close();
        }
      }
      socket?.off("join-room");
      socket?.off("offer");
      socket?.off("answer");
      socket?.off("ice-candidate");
      socket?.off("room-leave");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [huddleOn, chatId]);

  const initiateCall = useCallback(
    async (user: string) => {
      try {
        console.log("pcrefs", pcRefs);
        console.log("initiate call user", user);
        const offer = await pcRefs.current[user]?.createOffer({
          offerToReceiveVideo: !screenSharing, // Only offer video if not screen sharing
        });
        console.log("offfer", offer);
        await pcRefs.current[user]?.setLocalDescription(offer);
        const localDescription = pcRefs.current[user]?.localDescription;
        sendOffer(localDescription as RTCSessionDescriptionInit, user);
      } catch (error) {
        console.log("Error creating and sending offer:", error);
      }
    },
    [screenSharing, sendOffer]
  );

  useEffect(() => {
    async function setupPeerConnections() {
      for (const user in connectedUsers) {
        await setUpPeerConnection(user);
        await initiateCall(user);
      }
    }
    if (connectedUsers) {
      setupPeerConnections();
    }
  }, [connectedUsers, initiateCall, setUpPeerConnection]);

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
      videoref2.current.srcObject = remoteStream;
    }
  }, [videoStream, huddleDialogOpen, huddleOn, remoteStream]);

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

      <div className="flex flex-row">
        <div className="w-64 hidden sm:block relative">
          <div className="h-full">
            <SideBar
              showSideBar={showSideBar}
              setShowSideBar={setShowSideBar}
            />
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
            <Header />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
