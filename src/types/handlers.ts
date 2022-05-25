import { ClientHandler, RoomHandler } from "./common";
import { CreateRoomDto, JoinRoomDto, LoginDto, SendMessageDto } from "./dto";

export type LoginHandler = (dto: LoginDto, cb: ClientHandler) => void;

export type OutHandler = (cb?: ClientHandler) => void;

export type CreateRoomHandler = (dto: CreateRoomDto, cb: RoomHandler) => void;

export type JoinRoomHandler = (dto: JoinRoomDto, cb: RoomHandler) => void;

export type SendMessageHandler = (
  dto: SendMessageDto,
  cb: ClientHandler
) => void;
