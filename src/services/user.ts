import { Room, User } from "../types";
import { AbstractService } from "./abs";

export class UsersService extends AbstractService<User> {
  addRoomToUser(userId: User["id"], roomId: Room["id"]) {
    const user = this.data.find((item) => item.id === userId);

    if (!user) {
      return;
    }

    user.rooms.push(roomId);
  }

  checkIfRoomEmpty(roomIds: Room["id"][]): Room["id"][] {
    const allRooms = [...new Set(...this.data.map((user) => user.rooms))];

    const emptyRooms: Room["id"][] = [];

    allRooms.forEach((roomId: Room["id"]) => {
      if (!roomIds.includes(roomId)) {
        return;
      }

      emptyRooms.push(roomId);
    });

    return emptyRooms;
  }
}

const users: User[] = [];
export const usersService = new UsersService(users);
