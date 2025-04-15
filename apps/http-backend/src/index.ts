import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/database/client";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { middleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: parsedData.error.message });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: parsedData.error.message });
    return;
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ message: parsedData.error.message });
    return;
  }

  // @ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);

  try {
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId
      },
      orderBy: {
        id: "desc"
      },
      take: 50
    });

    res.json({
      messages
    });
  } catch(e) {
    res.status(500).json({ message: e });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
