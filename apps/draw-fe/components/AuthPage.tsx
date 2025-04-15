"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black text-white">
      <div className="p-2 m-2 rounded-md flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center mb-2">
          {isSignin ? "Sign In" : "Sign Up"}
        </h1>
        <input
          type="text"
          value={username}
          placeholder="Username"
          className="focus:outline-none w-full p-2 border border-gray-400 rounded-md"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          className="focus:outline-none w-full p-2 border border-gray-400 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isSignin && (
          <input
            type="text"
            value={name}
            placeholder="Name"
            className="focus:outline-none w-full p-2 border border-gray-400 rounded-md"
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <Button
          className="mt-2"
          onClick={() => {
            axios
              .post(`${BACKEND_URL}/signin`, { username, password })
              .then((res) => {
                const token = res.data.token;
                localStorage.setItem("token", token);
                router.push('/canvas');
              });
          }}
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </Button>
      </div>
    </div>
  );
}
