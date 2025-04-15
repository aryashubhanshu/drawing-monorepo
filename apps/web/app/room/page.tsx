"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Room() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-black text-white">
      <main className="flex items-center flex-col h-full">
        <h1 className="text-4xl font-bold my-8">Join a Room</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border border-white px-4 py-2 rounded-md"
          />

          <button
            onClick={() => {
              router.push(`/room/${roomId}`);
            }}
            className="bg-white text-black px-4 py-2 rounded-md"
          >
            Join
          </button>
        </div>
      </main>
    </div>
  );
}
