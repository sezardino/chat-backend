import { Room } from "../types";
import { AbstractService } from "./abs";

export class RoomsService extends AbstractService<Room> {}

const rooms: Room[] = [];
export const roomsService = new RoomsService(rooms);
