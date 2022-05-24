import { Message, Room } from "../types";
import { AbstractService } from "./abs";

export class RoomsService extends AbstractService<Room> {
  addMessageToRoom(roomId: Room["id"], message: Message): Message[] {
    const neededRoom = this.data.find((item) => item.id === roomId);

    if (!neededRoom) {
      throw new Error("Room not found");
    }

    neededRoom.messages.push(message);

    return neededRoom.messages;
  }
}

const rooms: Room[] = [];
export const roomsService = new RoomsService(rooms);
