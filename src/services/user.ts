import { User } from "../types";
import { AbstractService } from "./abs";

export class UsersService extends AbstractService<User> {}

const users: User[] = [];
export const usersService = new UsersService(users);
