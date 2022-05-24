import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

import {
  LoginDto,
  User,
  CreateRoomDto,
  Room,
  SendMessageDto,
  JoinRoomDto,
  ClientHandler,
  Message,
  NewMessageDto,
} from "./types";
import { usersService } from "./services/user";
import { roomsService } from "./services/room";

dotenv.config();

const app = express();
const httpsServer = createServer(app);
const io = new Server(httpsServer);

app.use(cors({ origin: process.env.CLIENT_URL || "" }));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

httpsServer.listen(process.env.PORT || 5000);

io.on("connection", (socket) => {
  console.log("connect");

  socket.on("login", (dto: LoginDto, handler: ClientHandler) => {
    const hasUser = usersService.get(socket.id);

    if (hasUser) {
      handler({ type: "error", title: "You are already logged in" });

      return;
    }

    const newUser: User = {
      name: dto.name,
      id: dto.id,
      rooms: [],
    };

    usersService.add(newUser);
    handler({ type: "success", title: "User created Successfully" });
  });

  socket.on("logout", (cb: ClientHandler) => {
    const hasUser = usersService.get(socket.id);

    if (!hasUser) {
      socket.emit("logout-fail", "User not logged in");
      return;
    }

    usersService.delete(socket.id);
    cb({ type: "success", title: "User logged out successfully" });
  });

  socket.on("create-room", ({ id }: CreateRoomDto, cb: ClientHandler) => {
    console.log("createRoom");
    const user = usersService.get(socket.id);

    if (!user) {
      cb({ title: "User not logged in", type: "error" });
      return;
    }

    const newRoom: Room = { id, messages: [] };

    const hasRoom = roomsService.get(newRoom.id);

    if (hasRoom) {
      cb({ title: "Room already exists", type: "error" });
      return;
    }

    roomsService.add(newRoom);
    usersService.addRoomToUser(socket.id, newRoom);

    socket.join(newRoom.id);

    cb({ title: "Room created", type: "success" });

    socket.in(newRoom.id).emit("room-notification", {
      title: "Creation",
      description: `${user.name} just create this room`,
    });
  });

  socket.on("join-room", ({ room }: JoinRoomDto, cb: ClientHandler) => {
    const neededRoom = roomsService.get(room);

    if (!neededRoom) {
      cb({ title: "Room does not exist", type: "error" });
      return;
    }

    const user = usersService.get(socket.id);

    if (!user) {
      cb({ title: "User not logged in", type: "error" });
      return;
    }

    socket.join(room);
    usersService.addRoomToUser(socket.id, neededRoom);
    cb({ title: "You are join to room", type: "success" });
    // socket.in(room).emit("room-notification", {
    //   title: "Join",
    //   description: `${user.name} just join this room`,
    // });
  });

  socket.on(
    "send-message",
    ({ message, room }: SendMessageDto, cb: ClientHandler) => {
      console.log("send message");
      const user = usersService.get(socket.id);

      if (!user) {
        cb({ title: "User not logged in", type: "error" });
        return;
      }

      const hasRoom = roomsService.get(room);

      if (!hasRoom) {
        cb({ title: "Room does not exist", type: "error" });
        return;
      }

      if (!user.rooms.find((item) => item.id === room)) {
        cb({ title: "This user does not belong to this room", type: "error" });
        return;
      }

      const newMessage: Message = {
        ...message,
        date: Date.now(),
        id: uuid(),
      };

      try {
        const messages = roomsService.addMessageToRoom(room, newMessage);
        const newMessageDto: NewMessageDto = { messages };
        io.in(room).emit("new-message", newMessageDto);
      } catch (error) {
        cb({ title: error as string, type: "error" });
      }
    }
  );

  socket.on("disconnect", () => {
    const user = usersService.get(socket.id);

    if (!user) {
      return;
    }

    const emptyRooms = usersService.checkIfRoomEmpty(user.id);

    if (emptyRooms.length) {
      emptyRooms.forEach((room) => roomsService.delete(room.id));
    }

    usersService.delete(socket.id);
  });
});
