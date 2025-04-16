import { BACKEND_URL } from "@/app/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.messages;

  const shapes = messages.map((message: { message: string }) => {
    const messageData = JSON.parse(message.message);
    return messageData.shape;
  });

  return shapes;
}

function clearCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const ctx = canvas.getContext("2d");

  let existingShapes: Shape[] = await getExistingShapes(roomId);

  if (!ctx || !canvas) return;

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if(message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        existingShapes.push(parsedShape.shape);
        clearCanvas(canvas, ctx, existingShapes);
    }
  }

  clearCanvas(canvas, ctx, existingShapes);

  let clicked: boolean = false;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      }
    existingShapes.push(shape);

    socket.send(JSON.stringify({ type: "chat", roomId: Number(roomId), message: JSON.stringify({shape})}));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(canvas, ctx, existingShapes);

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
}
