import { Message, Room, User } from "./models";

export interface LoginDto {
  name: string;
  id: User["id"];
}

export interface CreateRoomDto {
  id: string;
}

export interface SendMessageDto {
  room: Room["id"];
  message: Pick<Message, "body" | "from">;
}

export interface JoinRoomDto {
  roomId: Room["id"];
}

export interface NewMessageDto {
  messages: Message[];
}
