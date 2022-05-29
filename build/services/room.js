"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsService = exports.RoomsService = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../types");
const abs_1 = require("./abs");
class RoomsService extends abs_1.AbstractService {
    create(name, userId) {
        const newRoom = { name, id: (0, uuid_1.v4)(), users: [userId], messages: [] };
        return this.add(newRoom);
    }
    addMessageToRoom(roomId, data) {
        const { body, from } = data;
        const neededRoom = this.getById(roomId);
        if (!neededRoom) {
            throw new Error(types_1.ErrorMessages.NO_ROOM);
        }
        neededRoom.messages.push({ body, from, date: Date.now(), id: (0, uuid_1.v4)() });
        return neededRoom.messages;
    }
    addUserToRoom(roomId, userId) {
        const neededRoom = this.getById(roomId);
        if (!neededRoom) {
            throw new Error(types_1.ErrorMessages.NO_ROOM);
        }
        neededRoom.users.push(userId);
    }
    deleteUserFromRoom(roomId, userId) {
        const neededRoom = this.getById(roomId);
        if (!neededRoom) {
            throw new Error(types_1.ErrorMessages.NO_ROOM);
        }
        neededRoom.users = neededRoom.users.filter((item) => item !== userId);
        if (neededRoom.users.length !== 0) {
            return;
        }
        this.data = this.data.filter((item) => item.id !== roomId);
    }
    deleteUserFromRooms(userId) {
        const neededRooms = [];
        this.data.forEach((room) => {
            if (!room.users.includes(userId)) {
                return;
            }
            neededRooms.push(room);
        });
        neededRooms.forEach((room) => {
            this.deleteUserFromRoom(room.id, userId);
        });
    }
}
exports.RoomsService = RoomsService;
const rooms = [];
exports.roomsService = new RoomsService(rooms);
