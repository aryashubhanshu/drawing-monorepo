"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { IconButton } from "./IconButton";
import { Circle, Minus, RectangleHorizontal } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "line";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div className="h-full w-full bg-black text-white relative">
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
      ></canvas>
      <div className="absolute top-2 left-2">
        <Button>
          <IconButton
            icon={<Minus />}
            onClick={() => setSelectedTool("line")}
            activated={selectedTool === "line"}
          />
        </Button>
        <Button>
          <IconButton
            icon={<Circle />}
            onClick={() => setSelectedTool("circle")}
            activated={selectedTool === "circle"}
          />
        </Button>
        <Button>
          <IconButton
            icon={<RectangleHorizontal />}
            onClick={() => setSelectedTool("rect")}
            activated={selectedTool === "rect"}
          />
        </Button>
      </div>
    </div>
  );
}
