"use client";
import { SocketContext } from "@/ContextProvider/SocketProvider";
import { useNewChatMutation } from "@/redux/chat/chatApi";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NEW_MESSAAGE } from "@/constants";
import { useGetChannelUserMutation } from "@/redux/channel/channelApi";
import { setType } from "@/redux/misc/miscSlice";

type Props = {};

const Page = (props: Props) => {
  const textAreaRef = useRef(null);
  const { id, typeid } = useParams();
  const dispatch = useDispatch();

  const type = localStorage.getItem("type");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { _id } = useSelector((state: RootState) => state.workspace);
  const { chatId, members } = useSelector((state: RootState) => state.chat);
  const socket = useContext(SocketContext);

  const [createNewChat] = useNewChatMutation();

  const [getChannelUsers] = useGetChannelUserMutation();

  const route = useRouter();

  const submitMessage = async () => {
    socket?.emit(NEW_MESSAAGE, {
      chatId,
      members: members.map(
        (member: { _id: string; username: string }) => member._id
      ),
      message,
    });
    //setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  useEffect(() => {
    if (!socket) {
      console.log("Socket is not initialized");
      return;
    }

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on(NEW_MESSAAGE, (data) => {
      console.log("receivedchat", data.message.chat);
      console.log("Received data:", data.message);
      if (data.message.chat === chatId) {
        console.log("same chat id");
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    // Cleanup
    return () => {
      socket.off(NEW_MESSAAGE);
    };
  }, [socket, chatId, typeid]);

  useEffect(() => {
    const type = localStorage.getItem("type");

    const fetchChat = async () => {
      const response = await createNewChat({
        _id: typeid,
        type,
        organizationId: _id,
      });

      if (response.error) {
        route.push(`/s/${_id}`);
      } else {
        if (response.data.chat.isGroup) {
          dispatch(setType("channel"));
        } else {
          dispatch(setType("user"));
        }
      }
    };
    fetchChat();
  }, [typeid, id, _id, createNewChat, route, dispatch]);

  // find users that are not in channel but in workspace
  useEffect(() => {
    const fetchChannelUsers = async () => {
      const response = await getChannelUsers({
        channelId: typeid,
        organisationId: id,
      });
      return response;
    };

    const fetchData = async () => {
      if (type === "workspace") {
        route.push(`/s/${id}`);
      } else if (type === "user") {
      } else if (type === "channel") {
        const response = await fetchChannelUsers();
        console.log("channel", response);
      }
    };

    fetchData();
  }, [type, id, route, getChannelUsers, typeid]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 ">
        <div className="overflow-y-hidden relative w-full text-primary mt-4   ">
          {/* message */}
          {messages &&
            messages.map((message, index) => (
              <div
                className="w-full flex flex-row items-start gap-2 mb-4"
                key={index}
              >
                <div>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <div>
                    {message.sender.username}
                    <span className="text-xs text-muted-foreground pl-2">
                      10:12 am
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

          {/* message ends */}
        </div>
      </div>
      <div className="p-4 bg-background ">
        <form onSubmit={submitMessage}>
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded h-24 bg-card text-muted-foreground "
            placeholder="Type a message..."
          />
        </form>
      </div>
    </>
  );
};

export default Page;
