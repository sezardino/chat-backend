import { Room, User } from "./models";

export interface CreateChatDto {
  name: string;
  createdBy: User["id"];
}

export interface LoginDto {
  name: string;
}

export interface CreateRoomDto {
  id: string;
}

export interface SendMessageDto {
  room: Room["id"];
  message: string;
}
