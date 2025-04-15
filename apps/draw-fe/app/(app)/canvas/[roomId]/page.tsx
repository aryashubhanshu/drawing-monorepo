"use client";

import { useEffect, useRef, useState } from "react";

export default function CanvasRoom() {
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

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!ctx || !canvas) return;

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let clicked: boolean = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      clicked = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      clicked = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (clicked) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.strokeRect(startX, startY, width, height);
      }
    };

    canvas?.addEventListener("mousedown", handleMouseDown);
    canvas?.addEventListener("mouseup", handleMouseUp);
    canvas?.addEventListener("mousemove", handleMouseMove);

    // Clean up event listeners
    return () => {
      canvas?.removeEventListener("mousedown", handleMouseDown);
      canvas?.removeEventListener("mouseup", handleMouseUp);
      canvas?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvasRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
      ></canvas>
    </div>
  );
}
