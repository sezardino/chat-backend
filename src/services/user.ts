import { Room, User } from "../types";
import { AbstractService } from "./abs";

export class UsersService extends AbstractService<User> {
  addRoomToUser(userId: User["id"], room: Room) {
    const user = this.data.find((item) => item.id === userId);

    if (!user) {
      return;
    }

    user.rooms.push(room);
  }

  checkIfRoomEmpty(userId: User["id"]): Room[] {
    const user = this.data.find((item) => item.id === userId);

    if (!user) {
      return [];
    }

    const allRooms = [...new Set(...this.data.map((user) => user.rooms))];

    const emptyRooms: Room[] = [];

    allRooms.forEach((room) => {
      if (!user.rooms.find((item) => item.id === room.id)) {
        return;
      }

      emptyRooms.push(room);
    });

    return emptyRooms;
  }
}

const users: User[] = [];
export const usersService = new UsersService(users);
