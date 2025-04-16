"use client";

import { WS_URL } from "@/app/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {

  const [socket, setSocket] = useState<WebSocket | null>(null);

  
  useEffect(() => {
    const socket = new WebSocket(
      `${WS_URL}?token=${localStorage.getItem("token")}`
    );
    socket.onopen = () => {
      setSocket(socket);
      socket.send(JSON.stringify({ type: "join_room", roomId: Number(roomId) }));
    };

    return () => {
      socket?.close();
    };
  }, [roomId]);

  if (!socket)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Connecting to server...
      </div>
    );

  return <Canvas roomId={roomId} socket={socket} />
}
