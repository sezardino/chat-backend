import { ErrorMessages, Message, Room, User } from "../types";
import { AbstractService } from "./abs";

export class RoomsService extends AbstractService<Room> {
  addMessageToRoom(roomId: Room["id"], message: Message): Message[] {
    const neededRoom = this.data.find((item) => item.id === roomId);

    if (!neededRoom) {
      throw new Error(ErrorMessages.NO_ROOM);
    }

    neededRoom.messages.push(message);

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
    this.deleteEmptyRooms();
  }

  deleteUserFromRooms(userId: User["id"]) {
    const rooms = this.data.map((room) => {
      room.users = room.users.filter((item) => item !== userId);

      return room;
    });

    this.data = rooms;
    this.deleteEmptyRooms();
  }

  deleteEmptyRooms() {
    this.data = this.data.filter((room) => room.users.length > 0);
  }
}

const rooms: Room[] = [];
export const roomsService = new RoomsService(rooms);
