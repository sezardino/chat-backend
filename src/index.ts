import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";

import {
  User,
  Room,
  Message,
  NewMessageDto,
  ErrorMessages,
  SuccessMessages,
  Events,
  SocketClToSrvEvt,
  SocketInterSrvEvt,
  SocketSrvToClEvt,
  OutHandler,
  CreateRoomHandler,
  JoinRoomHandler,
  SendMessageHandler,
  LoginHandler,
} from "./types";
import { usersService } from "./services/user";
import { roomsService } from "./services/room";
import { getErrNotification, getSuccessNotification } from "./helpers";

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

io.on(Events.CONNECTION, (socket) => {
  console.log(Events.CONNECTION);

  const loginHandler: LoginHandler = (dto, cb) => {
    console.log();
    console.log(Events.LOGIN);

    const { id, name } = dto;
    const hasUser = usersService.get(socket.id);

    if (hasUser) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));

      return;
    }

    const newUser: User = { name, id };

    usersService.add(newUser);
    cb(getSuccessNotification(SuccessMessages.USER_CREATED));
  };

  const outHandler: OutHandler = (cb) => {
    console.log(Events.LOGOUT);
    const hasUser = usersService.get(socket.id);

    if (!hasUser && typeof cb === "function") {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    usersService.delete(socket.id);
    roomsService.deleteUserFromRooms(socket.id);

    if (!cb || typeof cb !== "function") {
      return;
    }

    cb(getSuccessNotification(SuccessMessages.LOGGED_OUT));
  };

  const createRoomHandler: CreateRoomHandler = (dto, cb) => {
    console.log(Events.CREATE_ROOM);
    const { id } = dto;
    const user = usersService.get(socket.id);

    if (!user) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    const hasRoom = roomsService.get(id);

    if (hasRoom) {
      cb(getErrNotification(ErrorMessages.ROOM_EXIST));
      return;
    }

    const newRoom: Room = { id, messages: [], users: [] };
    roomsService.add(newRoom);
    roomsService.addUserToRoom(id, socket.id);
    cb(getSuccessNotification(SuccessMessages.ROOM_CREATED), newRoom);
  };

  const joinRoomHandler: JoinRoomHandler = (dto, cb) => {
    console.log(Events.JOIN_ROOM);
    const { roomId } = dto;
    const user = usersService.get(socket.id);

    if (!user) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    const neededRoom = roomsService.get(roomId);

    if (!neededRoom) {
      cb(getErrNotification(ErrorMessages.NO_ROOM));
      return;
    }

    roomsService.addUserToRoom(roomId, socket.id);
    cb(getSuccessNotification(SuccessMessages.JOIN_ROOM), neededRoom);
  };

  const sendMessageHandler: SendMessageHandler = (dto, cb) => {
    console.log(Events.SEND_MESSAGE);
    const { message, room } = dto;
    const user = usersService.get(socket.id);

    if (!user) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    const neededRoom = roomsService.get(room);

    if (!neededRoom) {
      cb(getErrNotification(ErrorMessages.NO_ROOM));
      return;
    }

    if (!neededRoom.users.find((item) => item === user.id)) {
      cb(getErrNotification(ErrorMessages.USER_NOT_IN_ROOM));
      return;
    }

    const newMessage: Message = { ...message, date: Date.now(), id: uuid() };

    try {
      const messages = roomsService.addMessageToRoom(room, newMessage);
      const newMessageDto: NewMessageDto = { messages };
      io.emit(`${Events.NEW_MESSAGE}-${neededRoom.id}`, newMessageDto);
    } catch (error) {
      getErrNotification(error as string);
    }
  };

  socket.on(Events.LOGIN, loginHandler);
  socket.on(Events.LOGOUT, outHandler);
  socket.on(Events.CREATE_ROOM, createRoomHandler);
  socket.on(Events.JOIN_ROOM, joinRoomHandler);
  socket.on(Events.SEND_MESSAGE, sendMessageHandler);
  socket.on(Events.DISCONNECT, outHandler);
});
