import { v4 as uuid } from "uuid";
import { ErrorMessages, Message, NewMessageData, Room, User } from "../types";
import { AbstractService } from "./abs";

export class RoomsService extends AbstractService<Room> {
  create(name: Room["name"], userId: User["id"]): Room {
    const newRoom: Room = { name, id: uuid(), users: [userId], messages: [] };

    return this.add(newRoom);
  }

  addMessageToRoom(roomId: Room["id"], data: NewMessageData): Message[] {
    const { body, from = "system" } = data;
    const neededRoom = this.getById(roomId);

    if (!neededRoom) {
      throw new Error(ErrorMessages.NO_ROOM);
    }

    neededRoom.messages.push({ body, from, date: Date.now(), id: uuid() });

    return neededRoom.messages;
  }

  addUserToRoom(roomId: Room["id"], userId: User["id"]) {
    const neededRoom = this.getById(roomId);

    if (!neededRoom) {
      throw new Error(ErrorMessages.NO_ROOM);
    }

    neededRoom.users.push(userId);
  }

  deleteUserFromRoom(roomId: Room["id"], userId: User["id"]) {
    const neededRoom = this.getById(roomId);

    if (!neededRoom) {
      throw new Error(ErrorMessages.NO_ROOM);
    }

    neededRoom.users = neededRoom.users.filter((item) => item !== userId);

    if (neededRoom.users.length !== 0) {
      return;
    }

    this.data = this.data.filter((item) => item.id !== roomId);
  }

  deleteUserFromRooms(userId: User["id"]) {
    const neededRooms: Room[] = [];

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

const rooms: Room[] = [];
export const roomsService = new RoomsService(rooms);
