import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { controller } from "./controller";
import { LoginDto, User, CreateRoomDto, Room, SendMessageDto } from "./types";
import { usersService } from "./services/user";
import { v4 as uuid } from "uuid";
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
  socket.on("login", (dto: LoginDto) => {
    const hasUser = usersService.get(socket.id);

    if (hasUser) {
      socket.emit("login-fail", "User already logged in");
      return;
    }

    const newUser: User = {
      name: dto.name,
      id: socket.id,
      rooms: [],
    };

    usersService.add(newUser);

    socket.emit("login-success", newUser);
  });

  socket.on("logout", () => {
    const hasUser = usersService.get(socket.id);

    if (!hasUser) {
      socket.emit("logout-fail", "User not logged in");
      return;
    }

    usersService.delete(socket.id);
    socket.emit("logout-success");
  });

  socket.on("create-room", ({ id }: CreateRoomDto) => {
    const user = usersService.get(socket.id);

    if (!user) {
      socket.emit("create-room-fail", "User not logged in");
      return;
    }

    const newRoom: Room = { id };

    const hasRoom = roomsService.get(newRoom.id);

    if (hasRoom) {
      socket.emit("create-room-fail", "Room already exists");
      return;
    }

    roomsService.add(newRoom);
    usersService.addRoomToUser(socket.id, newRoom.id);
    socket.join(newRoom.id);
    socket.emit("create-room-success", newRoom);
    socket.in(newRoom.id).emit("room-notification", {
      title: "Creation",
      description: `${user.name} just create this room`,
    });
  });

  socket.on("join-room", ({ roomId }: { roomId: string }) => {
    const hasRoom = roomsService.get(roomId);

    if (!hasRoom) {
      socket.emit("join-room-fail", "Room does not exist");
      return;
    }

    const user = usersService.get(socket.id);

    if (!user) {
      socket.emit("join-room-fail", "User not logged in");
      return;
    }

    socket.join(roomId);
    usersService.addRoomToUser(socket.id, roomId);
    socket.emit("join-room-success", roomId);
    socket.in(roomId).emit("room-notification", {
      title: "Join",
      description: `${user.name} just join this room`,
    });
  });

  socket.on("send-message", ({ message, room }: SendMessageDto) => {
    const user = usersService.get(socket.id);

    if (!user) {
      socket.emit("send-message-fail", "User not logged in");
      return;
    }

    const hasRoom = roomsService.get(room);

    if (!hasRoom) {
      socket.emit("send-message-fail", "Room does not exist");
      return;
    }

    if (!user.rooms.includes(room)) {
      socket.emit(
        "send-message-fail",
        "This user does not belong to this room"
      );
      return;
    }

    socket.in(room).emit("message-success", {
      message,
      user,
    });
  });

  socket.on("disconnect", () => {
    const user = usersService.get(socket.id);

    if (!user) {
      return;
    }

    const emptyRooms = usersService.checkIfRoomEmpty(user.rooms);

    if (emptyRooms.length) {
      emptyRooms.forEach((roomId) => roomsService.delete(roomId));
    }

    usersService.delete(socket.id);
  });
});
