import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/database/client";

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success) {
        console.log(parsedData.error);
        res.status(400).json({ message: "Invalid data" });
        return;
    }

    try {        
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name,
            }
        });
        
        res.json({
            userId: user.id
        })
    } catch(error) {
        res.status(500).json({ message: error });
    }

});

app.post("/signin", async (req, res) => {

    const data = SignInSchema.safeParse(req.body);

    if(!data.success) {
        res.status(400).json({ message: data.error.message });
        return;
    }

    // const userId = await prisma.user.findFirst({
    //     where: {
    //         email: data.data.username,
    //         password: data.data.password
    //     },
    //     select: {
    //         id: true
    //     }
    // });

    const userId = "1";

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        token
    });

});

app.post("/room", middleware, (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);

    if(!data.success) {
        res.status(400).json({ message: data.error.message });
        return;
    }

    res.json({
        roomId: 123
    })
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});