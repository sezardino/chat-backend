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
  ErrorMessages,
  SuccessMessages,
  Events,
} from "./types";
import { usersService } from "./services/user";
import { roomsService } from "./services/room";
import { getErrNotification, getSuccessNotification } from "./helpers";

dotenv.config();

const app = express();
const httpsServer = createServer(app);
const io = new Server(httpsServer);

app.use(cors({ origin: process.env.CLIENT_URL || "" }));

app.get("/", (_, res) => {
  res.send("Hello World!");
});

httpsServer.listen(process.env.PORT || 5000);

io.on(Events.CONNECTION, (socket) => {
  console.log(Events.CONNECTION);

  const loginHandler = (dto: LoginDto, cb: ClientHandler) => {
    console.log(Events.LOGIN);

    const { id, name } = dto;
    const hasUser = usersService.get(socket.id);

    if (hasUser) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));

      return;
    }

    const newUser: User = { name, id, rooms: [] };

    usersService.add(newUser);
    cb(getSuccessNotification(SuccessMessages.USER_CREATED));
  };

  const logoutHandler = (cb: ClientHandler) => {
    console.log(Events.LOGOUT);
    const hasUser = usersService.get(socket.id);

    if (!hasUser) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    usersService.delete(socket.id);
    cb(getSuccessNotification(SuccessMessages.LOGGED_OUT));
  };

  const createRoomHandler = (dto: CreateRoomDto, cb: ClientHandler) => {
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

    const newRoom: Room = { id, messages: [] };
    roomsService.add(newRoom);
    usersService.addRoomToUser(socket.id, newRoom);

    cb(getSuccessNotification(SuccessMessages.ROOM_CREATED));
  };

  const joinRoomHandler = (dto: JoinRoomDto, cb: ClientHandler) => {
    console.log(Events.JOIN_ROOM);
    const { roomId } = dto;
    const neededRoom = roomsService.get(roomId);

    if (!neededRoom) {
      cb(getErrNotification(ErrorMessages.NO_ROOM));
      return;
    }

    const user = usersService.get(socket.id);

    if (!user) {
      cb(getErrNotification(ErrorMessages.NOT_LOGGED));
      return;
    }

    usersService.addRoomToUser(socket.id, neededRoom);
    cb(getSuccessNotification(SuccessMessages.JOIN_ROOM));
  };

  const sendMessageHandler = (dto: SendMessageDto, cb: ClientHandler) => {
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

    if (!user.rooms.find((item) => item.id === room)) {
      cb(getErrNotification(ErrorMessages.USER_NOT_IN_ROOM));
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
      io.emit(`${Events.NEW_MESSAGE}-${neededRoom.id}`, newMessageDto);
    } catch (error) {
      getErrNotification(error as string);
    }
  };

  const disconnectHandler = () => {
    console.log(Events.DISCONNECT);
    const user = usersService.get(socket.id);

    if (!user) {
      return;
    }

    const emptyRooms = usersService.checkIfRoomEmpty(user.id);

    if (emptyRooms.length) {
      emptyRooms.forEach((room) => roomsService.delete(room.id));
    }

    usersService.delete(socket.id);
  };

  socket.on(Events.LOGIN, loginHandler);
  socket.on(Events.LOGOUT, logoutHandler);
  socket.on(Events.CREATE_ROOM, createRoomHandler);
  socket.on(Events.JOIN_ROOM, joinRoomHandler);
  socket.on(Events.SEND_MESSAGE, sendMessageHandler);
  socket.on(Events.DISCONNECT, disconnectHandler);
});
