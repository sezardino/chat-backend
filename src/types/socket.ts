import { ServerEvents, ClientEvents } from "./events";
import {
  SendMessageHandler,
  CreateRoomHandler,
  JoinRoomHandler,
  LoginHandler,
  OutHandler,
} from "./handlers";
import { Message, Room, User } from "./models";

export interface SocketSrvToClEvt {
  [ServerEvents.LOGIN_SUCCESS]: (user: User) => void;
  [ServerEvents.LOGIN_FAIL]: (err: string) => void;
  [ServerEvents.OUT_FAIL]: (err: string) => void;
  [ServerEvents.OUT_SUCCESS]: () => void;
  [ServerEvents.CREATE_ROOM_FAIL]: (err: string) => void;
  [ServerEvents.CREATE_ROOM_SUCCESS]: (room: Room) => void;
  [ServerEvents.JOIN_ROOM_SUCCESS]: (room: Room) => void;
  [ServerEvents.JOIN_ROOM_FAIL]: (err: string) => void;
  [ServerEvents.NEW_MESSAGE]: (messages: Message[]) => void;
  [ServerEvents.SEND_MESSAGE_FAIL]: (err: string) => void;
  [ServerEvents.SEND_MESSAGE_SUCCESS]: () => void;
}

export interface SocketClToSrvEvt {
  [ClientEvents.SEND_MESSAGE]: SendMessageHandler;
  [ClientEvents.LOGIN]: LoginHandler;
  [ClientEvents.LOGOUT]: OutHandler;
  [ClientEvents.CREATE_ROOM]: CreateRoomHandler;
  [ClientEvents.JOIN_ROOM]: JoinRoomHandler;
  [ClientEvents.DISCONNECT]: OutHandler;
}

export interface SocketInterSrvEvt {}

export interface SocketData {}
