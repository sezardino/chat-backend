import { CreateRoomDto, JoinRoomDto, LoginDto, SendMessageDto } from "./dto";
import { User } from "./models";

export type LoginHandler = (dto: LoginDto) => void;

export type OutHandler = (userId: User["id"]) => void;

export type CreateRoomHandler = (dto: CreateRoomDto) => void;

export type JoinRoomHandler = (dto: JoinRoomDto) => void;

export type SendMessageHandler = (dto: SendMessageDto) => void;
