import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import {
  ErrorMessages,
  ClientEvents,
  ServerEvents,
  SocketClToSrvEvt,
  SocketInterSrvEvt,
  SocketSrvToClEvt,
  OutHandler,
  CreateRoomHandler,
  JoinRoomHandler,
  SendMessageHandler,
  LoginHandler,
  Room,
  NewMessageData,
} from "./types";

import { usersService } from "./services/user";
import { roomsService } from "./services/room";

dotenv.config();
const app = express();
const httpsServer = createServer(app);
const io = new Server<SocketClToSrvEvt, SocketSrvToClEvt, SocketInterSrvEvt>(
  httpsServer
);

app.use(cors({ origin: process.env.CLIENT_URL || "" }));
app.get("/", (_, res) => {
  res.send("Hello World!");
});
httpsServer.listen(process.env.PORT || 5000);

io.on("connection", (socket) => {
  console.log("connection");

  const loginHandler: LoginHandler = (dto) => {
    console.log(ClientEvents.LOGIN);

    const { id, name } = dto;
    const hasUser = usersService.getById(id);

    if (hasUser) {
      return io.emit(ServerEvents.LOGIN_FAIL, ErrorMessages.USER_EXIST);
    }

    const newUser = usersService.add({ name, id });

    io.emit(ServerEvents.LOGIN_SUCCESS, newUser);
  };

  const outHandler: OutHandler = (userId) => {
    console.log(ClientEvents.LOGOUT);
    const neededUser = usersService.getById(userId);

    if (!neededUser) {
      return io.emit(ServerEvents.OUT_FAIL, ErrorMessages.NOT_LOGGED);
    }

    usersService.delete(userId);
    roomsService.deleteUserFromRooms(userId);
    io.emit(ServerEvents.OUT_SUCCESS);
  };

  const createRoomHandler: CreateRoomHandler = (dto) => {
    console.log(ClientEvents.CREATE_ROOM);
    const { name, userId } = dto;
    const user = usersService.getById(userId);

    if (!user) {
      return io.emit(ServerEvents.CREATE_ROOM_FAIL, ErrorMessages.NOT_LOGGED);
    }

    const hasRoom = roomsService.getByName(name);

    if (hasRoom) {
      return io.emit(ServerEvents.CREATE_ROOM_FAIL, ErrorMessages.ROOM_EXIST);
    }

    const newRoom = roomsService.create(name, userId);

    socket.join(newRoom.id);
    io.emit(ServerEvents.CREATE_ROOM_SUCCESS, newRoom);
    newMessageHandler(newRoom.id, { body: `${user.name} create room` });
  };

  const joinRoomHandler: JoinRoomHandler = (dto) => {
    console.log(ClientEvents.JOIN_ROOM);
    const { roomName, userId } = dto;

    const user = usersService.getById(userId);

    if (!user) {
      return io.emit(ServerEvents.JOIN_ROOM_FAIL, ErrorMessages.NOT_LOGGED);
    }

    const neededRoom = roomsService.getByName(roomName);

    if (!neededRoom) {
      return io.emit(ServerEvents.JOIN_ROOM_FAIL, ErrorMessages.NO_ROOM);
    }

    roomsService.addUserToRoom(neededRoom.id, userId);
    socket.join(neededRoom.id);
    io.emit(ServerEvents.JOIN_ROOM_SUCCESS, neededRoom);

    newMessageHandler(neededRoom.id, { body: `${user.name} join the room` });
  };

  const sendMessageHandler: SendMessageHandler = (dto) => {
    console.log(ClientEvents.SEND_MESSAGE);
    const { message, room } = dto;

    const user = usersService.getById(socket.id);

    if (!user) {
      return io.emit(ServerEvents.SEND_MESSAGE_FAIL, ErrorMessages.NOT_LOGGED);
    }

    const neededRoom = roomsService.getById(room);

    if (!neededRoom) {
      return io.emit(ServerEvents.SEND_MESSAGE_FAIL, ErrorMessages.NO_ROOM);
    }

    if (!neededRoom.users.find((item) => item === user.id)) {
      return io.emit(
        ServerEvents.SEND_MESSAGE_FAIL,
        ErrorMessages.USER_NOT_IN_ROOM
      );
    }

    newMessageHandler(room, message);
  };

  const newMessageHandler = (roomId: Room["id"], message: NewMessageData) => {
    const messages = roomsService.addMessageToRoom(roomId, message);
    io.in(roomId).emit(ServerEvents.NEW_MESSAGE, messages);
  };

  const disconnectHandler = () => {
    console.log("disconnect");
    const user = usersService.getById(socket.id);

    if (!user) {
      return;
    }

    usersService.delete(user.id);
    roomsService.deleteUserFromRooms(user.id);
  };

  socket.on(ClientEvents.LOGIN, loginHandler);
  socket.on(ClientEvents.LOGOUT, outHandler);
  socket.on(ClientEvents.CREATE_ROOM, createRoomHandler);
  socket.on(ClientEvents.JOIN_ROOM, joinRoomHandler);
  socket.on(ClientEvents.SEND_MESSAGE, sendMessageHandler);
  socket.on(ClientEvents.DISCONNECT, disconnectHandler);
});
