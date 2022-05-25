import {} from "./common";
import { NewMessageDto } from "./dto";
import { Events } from "./events";
import {
  LoginHandler,
  CreateRoomHandler,
  JoinRoomHandler,
  SendMessageHandler,
  OutHandler,
} from "./handlers";

export interface SocketSrvToClEvt {
  [key: string]: (dto: NewMessageDto) => void;
}

export interface SocketClToSrvEvt {
  [Events.LOGIN]: LoginHandler;
  [Events.LOGOUT]: OutHandler;
  [Events.CREATE_ROOM]: CreateRoomHandler;
  [Events.JOIN_ROOM]: JoinRoomHandler;
  [Events.SEND_MESSAGE]: SendMessageHandler;
  [Events.DISCONNECT]: OutHandler;
}

export interface SocketInterSrvEvt {}

export interface SocketData {}
