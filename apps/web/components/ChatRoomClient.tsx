"use client";

import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(JSON.stringify({ type: "join_room", roomId: id }));

      socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        if (parsedMessage.type === "chat") {
          setChats((chats) => [...chats, {message: parsedMessage.message }]);
        }
      };
    }
    return () => {
      socket?.close();
    };
  }, [socket, loading, id]);

  return (
    <div className="flex justify-between flex-col h-full">
      <div className="flex flex-col gap-2 overflow-y-scroll">
        {chats.map((chat, index) => (
          <div key={index} className="border border-white rounded-full w-fit px-2 py-1">{chat.message}</div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="border border-white px-4 py-2 rounded-md focus:outline-none"
          placeholder="Message"
        />
        <button
          className="bg-white text-black px-4 py-2 rounded-md"
          onClick={() => {
            socket?.send(
              JSON.stringify({
                type: "chat",
                message: currentMessage,
                roomId: id,
              })
            );
            setCurrentMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
