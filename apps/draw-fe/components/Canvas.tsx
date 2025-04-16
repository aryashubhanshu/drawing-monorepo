'use client'

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { initDraw } from "@/draw";

export function Canvas({roomId, socket}: {roomId: string; socket: WebSocket}) {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
      });

    useEffect(() => {
        if (typeof window !== "undefined") {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
    
        if (canvasRef.current) initDraw(canvasRef.current, roomId, socket);
      }, [canvasRef, roomId, socket]);
    
      return (
        <div className="h-full w-full bg-black text-white relative">
          <canvas
            ref={canvasRef}
            width={windowSize.width}
            height={windowSize.height}
          ></canvas>
          <div className="absolute top-2 left-2">
            <Button>Rectangle</Button>
          </div>
        </div>
      );
}