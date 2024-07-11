"use client";
import React, { useRef, useState } from "react";

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
import { Button } from "@/components/ui/button";

type Props = {};

const Page = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <Button onClick={() => setIsOpen(true)}>open</Button>
      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-full w-[80%]">
          some drawer content
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Page;
