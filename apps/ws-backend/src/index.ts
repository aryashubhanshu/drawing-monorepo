import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/database/client";

const wss = new WebSocketServer({ port: 3002 });

type User = {
  rooms: string[];
  userId: string;
  ws: WebSocket;
};

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") return null;
    if (!decoded || !decoded.userId) return null;

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close(4001, "Unauthorized");
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message as unknown as string); // {type: "join_room", roomId: "123"}

    if (parsedMessage.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedMessage.roomId);
    }

    if (parsedMessage.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;

      user.rooms = user?.rooms.filter((x) => x !== parsedMessage.roomId);
    }

    if (parsedMessage.type === "chat") {
      const roomId = parsedMessage.roomId;
      const message = parsedMessage.message;

      await prismaClient.chat.create({
        data: {
            userId,
            message,
            roomId
        }
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }
  });
});
