"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "./config";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="w-full h-screen bg-black text-white">
      <main className="flex items-center flex-col h-full">
        <h1 className="text-4xl font-bold my-8">Login to join a room</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-white px-4 py-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-white px-4 py-2 rounded-md"
          />

          <button
            onClick={() => {
              axios.post(`${BACKEND_URL}/signin`, { username, password }).then((res) => {
                localStorage.setItem("token", res.data.token);
                router.push("/room");
              });
            }}
            className="bg-white text-black px-4 py-2 rounded-md mt-2"
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}
