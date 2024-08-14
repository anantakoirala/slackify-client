"use client";
import { RootState } from "@/redux/store";
import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import Peer from "peerjs";

interface PeerContextValue {
  peerInstance: Peer | null;
  restartPeerConnection: () => void;
}

const defaultContextValue: PeerContextValue = {
  peerInstance: null,
  restartPeerConnection: () => {
    console.warn("restartPeerConnection called without a Peer instance.");
  },
};

export const PeerContext = createContext<PeerContextValue>(defaultContextValue);

const PeerProvider = ({ children }: { children: React.ReactNode }) => {
  const { _id } = useSelector((state: RootState) => state.workspace);
  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);

  const initializePeer = useCallback(() => {
    const peer = new Peer({
      host: "localhost",
      port: 7000,
      path: "/peerjs",
    });

    peer.on("open", (id) => {
      console.log("Connected with Peer ID:", id);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    setPeerInstance(peer);

    return peer;
  }, []);

  const restartPeerConnection = useCallback(() => {
    console.log("restarting peer connection");
    if (peerInstance) {
      peerInstance.disconnect();
      peerInstance.destroy();
    }
    initializePeer();
  }, [peerInstance, initializePeer]);

  useEffect(() => {
    const peer = initializePeer();

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, [initializePeer]);

  return (
    <PeerContext.Provider value={{ peerInstance, restartPeerConnection }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;
