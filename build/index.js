"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const types_1 = require("./types");
const user_1 = require("./services/user");
const room_1 = require("./services/room");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpsServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpsServer);
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL || "" }));
app.get("/", (_, res) => {
    res.send("Hello World!");
});
httpsServer.listen(process.env.PORT || 5000);
io.on("connection", (socket) => {
    console.log("connection");
    const loginHandler = (dto) => {
        console.log(types_1.ClientEvents.LOGIN);
        const { id, name } = dto;
        const hasUser = user_1.usersService.getById(id);
        if (hasUser) {
            return io.emit(types_1.ServerEvents.LOGIN_FAIL, types_1.ErrorMessages.USER_EXIST);
        }
        const newUser = user_1.usersService.add({ name, id });
        io.emit(types_1.ServerEvents.LOGIN_SUCCESS, newUser);
    };
    const outHandler = (userId) => {
        console.log(types_1.ClientEvents.LOGOUT);
        const neededUser = user_1.usersService.getById(userId);
        if (!neededUser) {
            return io.emit(types_1.ServerEvents.OUT_FAIL, types_1.ErrorMessages.NOT_LOGGED);
        }
        user_1.usersService.delete(userId);
        room_1.roomsService.deleteUserFromRooms(userId);
        io.emit(types_1.ServerEvents.OUT_SUCCESS);
    };
    const createRoomHandler = (dto) => {
        console.log(types_1.ClientEvents.CREATE_ROOM);
        const { name, userId } = dto;
        const user = user_1.usersService.getById(userId);
        if (!user) {
            return io.emit(types_1.ServerEvents.CREATE_ROOM_FAIL, types_1.ErrorMessages.NOT_LOGGED);
        }
        const hasRoom = room_1.roomsService.getByName(name);
        if (hasRoom) {
            return io.emit(types_1.ServerEvents.CREATE_ROOM_FAIL, types_1.ErrorMessages.ROOM_EXIST);
        }
        const newRoom = room_1.roomsService.create(name, userId);
        socket.join(newRoom.id);
        io.emit(types_1.ServerEvents.CREATE_ROOM_SUCCESS, newRoom);
        newMessageHandler(newRoom.id, { body: `${user.name} create room` });
    };
    const joinRoomHandler = (dto) => {
        console.log(types_1.ClientEvents.JOIN_ROOM);
        const { roomName, userId } = dto;
        const user = user_1.usersService.getById(userId);
        if (!user) {
            return io.emit(types_1.ServerEvents.JOIN_ROOM_FAIL, types_1.ErrorMessages.NOT_LOGGED);
        }
        const neededRoom = room_1.roomsService.getByName(roomName);
        if (!neededRoom) {
            return io.emit(types_1.ServerEvents.JOIN_ROOM_FAIL, types_1.ErrorMessages.NO_ROOM);
        }
        room_1.roomsService.addUserToRoom(neededRoom.id, userId);
        socket.join(neededRoom.id);
        io.emit(types_1.ServerEvents.JOIN_ROOM_SUCCESS, neededRoom);
        newMessageHandler(neededRoom.id, { body: `${user.name} join the room` });
    };
    const sendMessageHandler = (dto) => {
        console.log(types_1.ClientEvents.SEND_MESSAGE);
        const { message, room } = dto;
        const user = user_1.usersService.getById(socket.id);
        if (!user) {
            return io.emit(types_1.ServerEvents.SEND_MESSAGE_FAIL, types_1.ErrorMessages.NOT_LOGGED);
        }
        const neededRoom = room_1.roomsService.getById(room);
        if (!neededRoom) {
            return io.emit(types_1.ServerEvents.SEND_MESSAGE_FAIL, types_1.ErrorMessages.NO_ROOM);
        }
        if (!neededRoom.users.find((item) => item === user.id)) {
            return io.emit(types_1.ServerEvents.SEND_MESSAGE_FAIL, types_1.ErrorMessages.USER_NOT_IN_ROOM);
        }
        newMessageHandler(room, message);
    };
    const newMessageHandler = (roomId, message) => {
        const messages = room_1.roomsService.addMessageToRoom(roomId, message);
        io.in(roomId).emit(types_1.ServerEvents.NEW_MESSAGE, messages);
    };
    const disconnectHandler = () => {
        console.log("disconnect");
        const user = user_1.usersService.getById(socket.id);
        if (!user) {
            return;
        }
        user_1.usersService.delete(user.id);
        room_1.roomsService.deleteUserFromRooms(user.id);
    };
    socket.on(types_1.ClientEvents.LOGIN, loginHandler);
    socket.on(types_1.ClientEvents.LOGOUT, outHandler);
    socket.on(types_1.ClientEvents.CREATE_ROOM, createRoomHandler);
    socket.on(types_1.ClientEvents.JOIN_ROOM, joinRoomHandler);
    socket.on(types_1.ClientEvents.SEND_MESSAGE, sendMessageHandler);
    socket.on(types_1.ClientEvents.DISCONNECT, disconnectHandler);
});
